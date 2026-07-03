# Homelab Complete Documentation
> Dell OptiPlex 7070 SFF — Proxmox + K3s + Ollama + Cloudflare Zero Trust

**Owner:** Pasindu Jay (luci)  
**Last Updated:** July 2026  
**Domain:** `pasindujayasinghe.com`  
**Cloudflare Team:** `pasinduljay`

---

## 🖥️ Hardware

| Component | Detail |
|---|---|
| **Machine** | Dell OptiPlex 7070 SFF |
| **CPU** | Intel i7-9700 (8 cores @ 3.00GHz) |
| **RAM** | 32GB DDR4 |
| **Storage** | 240GB SSD |
| **Hypervisor** | Proxmox VE 9.2.3 |

---

## 🗺️ Full Network Map

```
Home Network: 192.168.1.0/24
Gateway:      192.168.1.1
DNS:          1.1.1.1, 8.8.8.8

Proxmox Host  →  192.168.1.100  (port 8006)
cp01          →  192.168.1.110  (K3s Control Plane)
wk01          →  192.168.1.111  (K3s Worker 1)
wk02          →  192.168.1.112  (K3s Worker 2)
website-vm    →  192.168.1.113  (NextJS + PostgreSQL + Cloudflare Tunnel) [future]
Windows Laptop→  192.168.1.2

K3s Pod Network:      10.42.0.0/16  (auto-managed, do not touch)
K3s Service Network:  10.43.0.0/16  (auto-managed, do not touch)
```

---

## 📋 VM Specifications

| VM | Role | vCPU | RAM | Disk | IP | OS |
|---|---|---|---|---|---|---|
| `cp01` | K3s Control Plane | 2 | 6GB | 32GB | 192.168.1.110 | Ubuntu 22.04 LTS |
| `wk01` | K3s Worker 1 | 2 | 8GB | 40GB | 192.168.1.111 | Ubuntu 22.04 LTS |
| `wk02` | K3s Worker 2 | 2 | 8GB | 40GB | 192.168.1.112 | Ubuntu 22.04 LTS |
| `website` | Web Server | 2 | 2GB | 30GB | 192.168.1.113 | Ubuntu 22.04 LTS |

**Username on all VMs:** `luci`

---

## 🔧 PART 1 — PROXMOX INSTALLATION

### 1.1 — Proxmox Install Settings

```
Filesystem:   ext4 (NOT ZFS RAID0 — single disk, no benefit)
Disk setup:   LVM-Thin
swapsize:     4GB
maxroot:      30GB
minfree:      16GB
maxvz:        leave blank (uses remaining space)
```

Resulting layout:
```
223GB SSD
├── EFI/boot      →   1GB
├── swap          →   4GB
├── Proxmox root  →  30GB
├── minfree       →  16GB
└── local-lvm     → ~172GB (VM storage pool)
```

### 1.2 — Management Network Configuration

```
Management Interface: nic0 (e1000e)
Hostname (FQDN):      lab.pasindujayasinghe.com
IP Address (CIDR):    192.168.1.100/24
Gateway:              192.168.1.1
DNS Server:           1.1.1.1
```

### 1.3 — Remove Subscription Popup

```bash
sed -i.bak "s/data.status !== 'Active'/false/g" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js
systemctl restart pveproxy
```

Auto-fix after every update:
```bash
cat > /usr/local/bin/remove-subscription-popup.sh << 'EOF'
#!/bin/bash
sed -i.bak "s/data.status !== 'Active'/false/g" \
  /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js
systemctl restart pveproxy
EOF
chmod +x /usr/local/bin/remove-subscription-popup.sh

cat > /etc/apt/apt.conf.d/99remove-popup << 'EOF'
DPkg::Post-Invoke { "/usr/local/bin/remove-subscription-popup.sh"; };
EOF
```

To revert:
```bash
cp /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js.bak \
   /usr/share/javascript/proxmox-widget-toolkit/proxmoxlib.js
systemctl restart pveproxy
```

### 1.4 — Fix Non-Production Repository Warning

Go to: `Updates → Repositories` → disable `pvetest` repository. Keep only `pve-no-subscription`.

---

## 🔧 PART 2 — VM CREATION IN PROXMOX

### 2.1 — Create VMs (General Tab)

| VM | VM ID | Name | Start at Boot |
|---|---|---|---|
| Control Plane | 100 | cp01 | ✅ |
| Worker 1 | 101 | wk01 | ✅ |
| Worker 2 | 102 | wk02 | ✅ |

### 2.2 — Ubuntu Install Settings (Same for All VMs)

```
Your name:     admin
Server name:   cp01  (or wk01, wk02)
Username:      luci
Password:      (your choice)
✅ Install OpenSSH server  ← IMPORTANT
```

### 2.3 — Fix LVM Disk — Only 19GB Used Out of 38GB (Critical Fix!)

Ubuntu installer only allocates half the disk by default. Fix on ALL VMs:

```bash
# Check current state
lsblk
df -h

# Extend LV to use all free space
sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv

# Resize filesystem
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv

# Verify — should now show full disk size
df -h
```

Expected before fix:
```
/dev/mapper/ubuntu--vg-ubuntu--lv   19G  9.2G  8.4G  53%
```

Expected after fix:
```
/dev/mapper/ubuntu--vg-ubuntu--lv   38G  9.2G   27G  26%
```

> ⚠️ Do this on cp01, wk01, AND wk02 — all have the same issue

---

## 🔧 PART 3 — VM NETWORK CONFIGURATION

### 3.1 — Static IP via Netplan (Each VM)

Edit `/etc/netplan/00-installer-config.yaml` on each VM:

**cp01:**
```yaml
network:
  version: 2
  ethernets:
    ens18:
      dhcp4: false
      addresses:
        - 192.168.1.110/24
      routes:
        - to: default
          via: 192.168.1.1
      nameservers:
        addresses: [1.1.1.1, 8.8.8.8]
```

**wk01:** Same but `192.168.1.111/24`  
**wk02:** Same but `192.168.1.112/24`

```bash
sudo netplan apply
```

### 3.2 — /etc/hosts (All 3 VMs — Identical)

```
127.0.0.1 localhost
192.168.1.110  cp01
192.168.1.111  wk01
192.168.1.112  wk02
# The following lines are desirable for IPv6 capable hosts
::1     ip6-localhost ip6-loopback
fe00::0 ip6-localnet
ff00::0 ip6-mcastprefix
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

> ⚠️ Do NOT include `127.0.1.1 cp01` — breaks K3s cluster communication

Test connectivity:
```bash
ping wk01
ping wk02
```

### 3.3 — System Update & Hostname

```bash
sudo apt update && sudo apt upgrade -y
sudo hostnamectl set-hostname cp01  # change per VM
```

---

## 🔧 PART 4 — K3s CLUSTER INSTALLATION

### 4.1 — Install K3s on cp01 (Control Plane ONLY)

```bash
curl -sfL https://get.k3s.io | sh -
```

Verify:
```bash
sudo kubectl get nodes
# NAME   STATUS   ROLES           AGE   VERSION
# cp01   Ready    control-plane   1m    v1.35.5+k3s1
```

### 4.2 — Fix kubectl Permissions (No More sudo)

```bash
mkdir -p ~/.kube
sudo cp /etc/rancher/k3s/k3s.yaml ~/.kube/config
sudo chown luci:luci ~/.kube/config
chmod 600 ~/.kube/config
echo "export KUBECONFIG=/home/luci/.kube/config" >> ~/.bashrc
source ~/.bashrc
```

Verify:
```bash
echo $KUBECONFIG
# /home/luci/.kube/config

kubectl get nodes
# Works without sudo ✅
```

### 4.3 — Get Worker Join Token

```bash
sudo cat /var/lib/rancher/k3s/server/node-token
```

> ⚠️ Keep this token secure

### 4.4 — Join Workers (wk01 and wk02)

```bash
curl -sfL https://get.k3s.io | \
  K3S_URL=https://192.168.1.110:6443 \
  K3S_TOKEN=YOUR_TOKEN_HERE \
  sh -
```

### 4.5 — Verify Full Cluster

```bash
kubectl get nodes
```

```
NAME   STATUS   ROLES           AGE    VERSION
cp01   Ready    control-plane   7m3s   v1.35.5+k3s1
wk01   Ready    <none>          83s    v1.35.5+k3s1
wk02   Ready    <none>          33s    v1.35.5+k3s1
```

✅ All 3 Ready = Cluster working!

---

## 🔧 PART 5 — WINDOWS LAPTOP SETUP

### 5.1 — Install kubectl

```powershell
winget install Kubernetes.kubectl
# Installed: v1.36.1
```

### 5.2 — Setup kubeconfig

```powershell
mkdir -Force $HOME\.kube
code $HOME\.kube\config
```

Paste content from `cat ~/.kube/config` on cp01. Change:
```yaml
server: https://127.0.0.1:6443
```
To:
```yaml
server: https://192.168.1.110:6443
```

### 5.3 — Install K9s (Terminal UI)

```powershell
winget install k9s
# Installed: v0.51.0
```

Run:
```powershell
k9s
```

K9s keyboard shortcuts:
```
0        → all namespaces
1        → default namespace
arrows   → navigate
Enter    → go into resource
l        → view logs
d        → describe
Ctrl+D   → delete
?        → help
```

### 5.4 — VS Code Extensions

Install via `Ctrl+Shift+X`:

| Extension | ID |
|---|---|
| Kubernetes | `ms-kubernetes-tools.vscode-kubernetes-tools` |
| YAML | `redhat.vscode-yaml` |

---

## 🔧 PART 6 — AI MODEL EXPERIMENT (DECOMMISSIONED)

All AI model configurations (Ollama, Open WebUI, and local storage claims) have been decommissioned to reclaim CPU, RAM, and Disk space for hosting the Next.js portfolio website and other development workloads.

---

---

## 🔧 PART 7 — CLOUDFLARE ZERO TRUST SETUP

### 7.1 — Overview

```
Remote Device (WARP connected)
      ↓
Cloudflare Zero Trust
      ↓
cloudflared tunnel (running as Docker container on Ubuntu VM)
      ↓
192.168.1.0/24 (entire home network accessible)
      ↓
Any device by IP: Proxmox, K3s nodes, Windows laptop RDP
```

### 7.2 — Cloudflare Account Details

| Item | Value |
|---|---|
| Team name | `pasinduljay` |
| Team domain | `pasinduljay.cloudflareaccess.com` |
| Login email | `pasindulakshitha0822@gmail.com` |
| Tunnel name | `PASINDULJAY` |
| cloudflared host | Ubuntu VM (Docker container) |

### 7.3 — Policies

| Policy | Purpose | Used By |
|---|---|---|
| `Home Network Access` | Controls WARP device enrollment | Device Enrollment |
| `admin` | Protects website admin URL | ADMIN application |

### 7.4 — cloudflared Docker Setup (Ubuntu VM)

```bash
mkdir -p ~/cloudflared
nano ~/cloudflared/docker-compose.yml
```

```yaml
services:
  cloudflared:
    image: cloudflare/cloudflared:latest
    container_name: cloudflared
    restart: unless-stopped
    network_mode: host
    command: tunnel --no-autoupdate run --token YOUR_TOKEN_HERE
```

> ⚠️ `network_mode: host` is CRITICAL — without it cannot route to 192.168.1.0/24
> ⚠️ `restart: unless-stopped` — auto-starts after VM reboot

```bash
cd ~/cloudflared
docker compose up -d

# Verify
docker compose logs -f
# Should show: Registered tunnel connection
```

Enable Docker on boot:
```bash
sudo systemctl enable docker
```

### 7.5 — Cloudflare Dashboard Configuration

**CIDR Route:**
```
Networks → Tunnels → PASINDULJAY → CIDR routes → Add
CIDR:         192.168.1.0/24
Description:  Home Network
Virtual network: default
```

**Split Tunnel Fix (Critical):**
```
Team & Resources → Devices → Device profiles → Default
→ Split Tunnels → Manage
→ Find 192.168.0.0/16 → DELETE IT
```
Without this, 192.168.1.x traffic bypasses the tunnel.

**Device Enrollment:**
```
Team & Resources → Devices → Management
→ Device enrollment permissions → Manage
→ Select existing policies → Home Network Access
```

### 7.6 — Install WARP Client (Remote Device)

```
Android:  Google Play → Cloudflare One Agent
Windows:  one.dash.cloudflare.com → Settings → Downloads
iOS:      App Store → Cloudflare One Agent
```

Enrollment steps:
```
1. Open Cloudflare One Agent
2. Select "Zero Trust security" (NOT consumer WARP)
3. Organization name: pasinduljay
4. Login: pasindulakshitha0822@gmail.com
5. Enter email PIN
6. Install VPN profile → OK
7. Toggle Connected ✅
```

### 7.7 — Remote Access Once WARP Connected

| Service | Address |
|---|---|
| Proxmox UI | `https://192.168.1.100:8006` |
| K3s cp01 | `192.168.1.110` |
| Windows RDP | `192.168.1.2:3389` |
| Router | `http://192.168.1.1` |

### 7.8 — Published Application Routes (Tunnel)

| Domain | Service | Purpose |
|---|---|---|
| `lab.pasindujayasinghe.com` | `https://192.168.1.100:8006` | Proxmox UI (public) |

> `rdp.pasindujayasinghe.com` was deleted — using WARP + CIDR instead

### 7.9 — RDP to Windows Laptop

Enable RDP on Windows:
```
Settings → System → Remote Desktop → ON
```

```powershell
# Allow through firewall
netsh advfirewall firewall set rule group="remote desktop" new enable=Yes
```

Login credentials:
```
Username: acer\luci  (or Microsoft email)
Password: Microsoft account password (NOT PIN)
```

If login fails:
```
Settings → Accounts → Sign-in options
→ Turn OFF "Only allow Windows Hello sign-in for Microsoft accounts"
```

---

## 🔧 PART 8 — IMPORTANT FILE LOCATIONS

| File | Location | Purpose |
|---|---|---|
| K3s kubeconfig (root) | `/etc/rancher/k3s/k3s.yaml` | Original (root only) |
| K3s kubeconfig (user) | `~/.kube/config` | User accessible |
| Windows kubeconfig | `C:\Users\Luci\.kube\config` | kubectl on laptop |
| K3s join token | `/var/lib/rancher/k3s/server/node-token` | Worker join token |
| Netplan config | `/etc/netplan/00-installer-config.yaml` | Static IP |
| cloudflared compose | `~/cloudflared/docker-compose.yml` | Tunnel container |

---

## 🔧 PART 9 — USEFUL COMMANDS

### Kubernetes

```bash
# Nodes
kubectl get nodes
kubectl get nodes -o wide
kubectl top nodes

# Pods
kubectl get pods -A
kubectl get pods -o wide
kubectl get pods -w                # watch live

# Describe / Logs
kubectl describe pod POD_NAME
kubectl logs POD_NAME -f

# Delete
kubectl delete pods --field-selector=status.phase=Failed
kubectl delete pod POD_NAME

# Restart deployment
kubectl rollout restart deployment/DEPLOYMENT_NAME

# Storage
kubectl get pvc -A
kubectl get storageclass
```

### K3s Service Management

```bash
sudo systemctl status k3s           # cp01
sudo systemctl restart k3s          # cp01
sudo systemctl status k3s-agent     # wk01/wk02
sudo systemctl restart k3s-agent    # wk01/wk02
sudo journalctl -u k3s -f           # logs
```

### Disk Management

```bash
lsblk                                              # check disk layout
df -h                                              # check usage
sudo lvextend -l +100%FREE /dev/mapper/ubuntu--vg-ubuntu--lv
sudo resize2fs /dev/mapper/ubuntu--vg-ubuntu--lv
```

### Docker (cloudflared VM)

```bash
docker compose up -d
docker compose logs -f
docker compose down
docker ps
```

---

## 🏗️ Full Architecture Diagram

```
Internet
    │
    ▼
Cloudflare Edge (pasindujayasinghe.com)
    │
    ├── lab.pasindujayasinghe.com → Proxmox UI
    └── pasindujayasinghe.com     → NextJS Portfolio (public)
    │
    ▼
cloudflared tunnel (Running inside K3s Node or Docker Container)
    │
    ▼
┌─────────────────────────────────────────────────────┐
│              Home Network 192.168.1.0/24            │
│                                                     │
│  Proxmox VE (192.168.1.100)                        │
│  ┌─────────────────────────────────────────────┐   │
│  │                                             │   │
│  │  cp01 (192.168.1.110) — K3s Control Plane  │   │
│  │  ├── kube-apiserver                         │   │
│  │  ├── kube-scheduler                         │   │
│  │  ├── kube-controller-manager                │   │
│  │  └── etcd                                   │   │
│  │                                             │   │
│  │  wk01 (192.168.1.111) — K3s Worker         │   │
│  │  ├── NextJS Portfolio App Pod               │   │
│  │  ├── PostgreSQL DB Pod                      │   │
│  │  └── cloudflared tunnel pod                 │   │
│  │                                             │   │
│  │  wk02 (192.168.1.112) — K3s Worker         │   │
│  │  └── (Available for Dev workloads/tests)     │   │
│  │                                             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Windows Laptop (192.168.1.2)                      │
│  ├── kubectl v1.36.1                               │
│  ├── K9s v0.51.0                                   │
│  ├── VS Code + Kubernetes extension                 │
│  └── Termius (SSH client)                          │
└─────────────────────────────────────────────────────┘
    ▲
    │ WARP (Cloudflare One Agent)
    │
Remote Device (anywhere in the world)
└── Access entire 192.168.1.0/24 as if on LAN
```

---

## ✅ Completion Status

### Done
- [x] Proxmox VE 9.2.3 installed (ext4, LVM-Thin)
- [x] Subscription popup removed permanently
- [x] 3 Ubuntu 22.04 VMs created (cp01, wk01, wk02)
- [x] LVM disk extended on all VMs (19GB → 38GB)
- [x] Static IPs configured via Netplan
- [x] /etc/hosts configured on all VMs
- [x] K3s installed on cp01 (control plane)
- [x] kubectl permissions fixed (no sudo)
- [x] wk01 and wk02 joined as workers
- [x] kubectl installed on Windows (v1.36.1)
- [x] kubeconfig configured on Windows
- [x] K9s installed on Windows (v0.51.0)
- [x] VS Code Kubernetes + YAML extensions installed
- [x] Cloudflare Zero Trust configured
- [x] CIDR route 192.168.1.0/24 added
- [x] Split tunnel fix applied
- [x] cloudflared Docker container setup

### In Progress
- [ ] Deploy NextJS Portfolio + PostgreSQL to K3s cluster

### Planned
- [ ] Setup Cloudflare Tunnel inside K3s cluster for the website
- [ ] Helm installation
- [ ] ArgoCD GitOps setup
- [ ] Prometheus + Grafana monitoring
- [ ] Additional K3s learning (Ingress, RBAC, StatefulSets)
- [ ] Migrate to kubeadm for CKA prep

---

## 🚨 Known Issues & Fixes

| Issue | Cause | Fix |
|---|---|---|
| Pod eviction (Evicted status) | Disk full on worker node | Extend LVM, delete evicted pods |
| kubectl needs sudo | K3s default permissions | Copy kubeconfig to ~/.kube/config |
| `127.0.1.1 cp01` in /etc/hosts | Ubuntu default | Remove it — breaks K3s networking |
| ContainerCreating for long time | Docker image downloading | Wait 5-10 mins for first pull |
| WARP can't reach 192.168.1.x | Split tunnel excludes private IPs | Delete 192.168.0.0/16 from exclude list |
| cloudflared can't route LAN | Bridge network mode | Use network_mode: host in compose |
