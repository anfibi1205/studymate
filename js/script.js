let tugas = JSON.parse(localStorage.getItem("tugas")) || [];

let jadwal = JSON.parse(localStorage.getItem("jadwal")) || [];

// SIMPAN DATA

function simpanData() {
    localStorage.setItem("tugas", JSON.stringify(tugas));
    localStorage.setItem("jadwal", JSON.stringify(jadwal));
}

// DASHBOARD

function updateDashboard() {

    let selesai = tugas.filter(t => t.selesai).length;

    document.getElementById("total").innerText = tugas.length;

    document.getElementById("selesai").innerText = selesai;

    document.getElementById("belum").innerText =
        tugas.length - selesai;
}

// TAMBAH TUGAS

function tambahTugas() {

    let nama = document.getElementById("namaTugas").value;

    let deadline = document.getElementById("deadline").value;

    if (!nama || !deadline) {
        alert("Isi nama tugas dan deadline!");
        return;
    }

    if (new Date(deadline).getTime() <= Date.now()) {
        alert("Pilih deadline di waktu mendatang!");
        return;
    }

    tugas.push({
        id: Date.now(),
        nama: nama,
        deadline: deadline,
        selesai: false,
        sudahDiingatkan: false
    });

    simpanData();
    tampilTugas();

    document.getElementById("namaTugas").value = "";
    document.getElementById("deadline").value = "";

    notifikasiKecil("Tugas berhasil ditambahkan! 💗");
}

// TAMPIL TUGAS

function tampilTugas() {

    let daftar = document.getElementById("daftarTugas");

    daftar.innerHTML = "";

    tugas.forEach((t, i) => {

        let div = document.createElement("div");

        div.className = "item";

        let info = document.createElement("div");

        let nama = document.createElement("strong");

        nama.textContent = t.nama;

        if (t.selesai) {
            nama.className = "selesai";
        }

        let waktu = document.createElement("p");

        waktu.textContent =
            "Deadline: " +
            new Date(t.deadline).toLocaleString("id-ID");

        info.append(nama, waktu);

        let tombol = document.createElement("div");

        let selesai = document.createElement("button");

        selesai.textContent = t.selesai ? "Batal" : "Selesai";

        selesai.onclick = () => {

            tugas[i].selesai = !tugas[i].selesai;

            simpanData();

            tampilTugas();

            notifikasiKecil("Progress diperbarui! ✨");
        };

        let hapus = document.createElement("button");

        hapus.textContent = "Hapus";

        hapus.style.background = "#e87599";

        hapus.onclick = () => {

            tugas.splice(i, 1);

            simpanData();

            tampilTugas();
        };

        tombol.append(selesai, hapus);

        div.append(info, tombol);

        daftar.appendChild(div);
    });

    updateDashboard();
}

// TAMBAH JADWAL

function tambahJadwal() {

    let hari = document.getElementById("hari").value;

    let mapel = document.getElementById("mapel").value;

    let jam = document.getElementById("jam").value;

    if (!hari || !mapel || !jam) {
        alert("Lengkapi jadwal terlebih dahulu!");
        return;
    }

    jadwal.push({
        hari: hari,
        mapel: mapel,
        jam: jam
    });

    simpanData();

    tampilJadwal();

    document.getElementById("hari").value = "";

    document.getElementById("mapel").value = "";

    document.getElementById("jam").value = "";

    notifikasiKecil("Jadwal berhasil ditambahkan! 📚");
}

// TAMPIL JADWAL

function tampilJadwal() {

    let daftar = document.getElementById("daftarJadwal");

    daftar.innerHTML = "";

    jadwal.forEach((j, i) => {

        let div = document.createElement("div");

        div.className = "item";

        let info = document.createElement("span");

        info.textContent =
            `${j.hari} | ${j.jam} | ${j.mapel}`;

        let hapus = document.createElement("button");

        hapus.textContent = "Hapus";

        hapus.onclick = () => {

            jadwal.splice(i, 1);

            simpanData();

            tampilJadwal();
        };

        div.append(info, hapus);

        daftar.appendChild(div);
    });
}

// CATATAN

function simpanCatatan() {

    let catatan = document.getElementById("isiCatatan").value;

    localStorage.setItem("catatan", catatan);

    document.getElementById("statusCatatan").innerText =
        "Catatan berhasil disimpan! 💗";

}

// NOTIFIKASI KECIL

function notifikasiKecil(pesan) {

    let toast = document.createElement("div");

    toast.textContent = pesan;

    toast.style.cssText = `
        position: fixed;
        bottom: 25px;
        right: 25px;
        background: #8172d8;
        color: white;
        padding: 16px 22px;
        border-radius: 12px;
        z-index: 999;
        animation: fadeUp .4s ease;
        box-shadow: 0 5px 20px #0002;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.style.opacity = "0";

        toast.style.transition = ".4s";

        setTimeout(() => toast.remove(), 400);

    }, 2500);
}

// AKTIFKAN NOTIFIKASI

function aktifkanNotifikasi() {

    if (!("Notification" in window)) {
        alert("Browser tidak mendukung notifikasi.");
        return;
    }

    Notification.requestPermission().then(izin => {

        if (izin === "granted") {

            alert("Notifikasi berhasil diaktifkan! 💗");

            cekPengingat();

        } else {

            alert("Izin notifikasi belum diberikan.");

        }

    });
}

// PENGINGAT DEADLINE

function cekPengingat() {

    if (
        !("Notification" in window) ||
        Notification.permission !== "granted"
    ) return;

    let sekarang = Date.now();

    tugas.forEach(t => {

        let deadline = new Date(t.deadline).getTime();

        let selisih = deadline - sekarang;

        if (
            !t.selesai &&
            !t.sudahDiingatkan &&
            selisih > 0 &&
            selisih <= 30 * 60 * 1000
        ) {

            new Notification("Pengingat Tugas! 📚", {
                body: t.nama + " akan segera mencapai deadline!"
            });

            t.sudahDiingatkan = true;

            simpanData();
        }

    });
}

// MUAT DATA CATATAN

document.getElementById("isiCatatan").value =
    localStorage.getItem("catatan") || "";

// JALANKAN WEBSITE

tampilTugas();

tampilJadwal();

setInterval(cekPengingat, 30000);