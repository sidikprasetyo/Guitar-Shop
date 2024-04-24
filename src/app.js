document.addEventListener("alpine:init", () => {
  Alpine.data("shop", () => ({
    items: [
      {
        id: 1,
        name: "Gibson Memphis ES-330",
        img: "1.jpg",
        price: 64900000,
      },
      {
        id: 2,
        name: "Cort EVL-K4 BKS",
        img: "2.jpg",
        price: 8845000,
      },
      {
        id: 3,
        name: "Fender Stratocaster",
        img: "3.jpg",
        price: 14900000,
      },
      {
        id: 4,
        name: "Taylor 324CE",
        img: "4.jpg",
        price: 16300000,
      },
      {
        id: 5,
        name: "Yamaha Classic Guitar",
        img: "5.jpg",
        price: 2300000,
      },
      {
        id: 6,
        name: "Epiphone Semi Hollow",
        img: "6.jpg",
        price: 7450000,
      },
    ],
  }));

  Alpine.store("cart", {
    items: [],
    total: 0,
    quantity: 0,
    add(newItem) {
      // check apakah ada barang yang sam di cart
      const cartItem = this.items.find((item) => item.id === newItem.id);

      // jika belum ada / cart kosong
      if (!cartItem) {
        this.items.push({ ...newItem, quantity: 1, total: newItem.price });
        this.quantity++;
        this.total += newItem.price;
      }
      // jika barang sudah ada di cart apakah barang sama atau beda dengan yang ada di cart
      else
        this.items = this.items.map((item) => {
          // jika barang berbeda
          if (item.id !== newItem.id) {
            return item;
          } else {
            // jika suah ada tambah quantity dan sub totalnya
            item.quantity++;
            item.total = item.price * item.quantity;
            this.quantity++;
            this.total += item.price;
            return item;
          }
        });
    },
    remove(id) {
      // ambil item yang mau diremove berdasarkan id
      const cartItem = this.items.find((item) => item.id === id);

      //   jika item lebih dari 1
      if (cartItem.quantity > 1) {
        // telusuri satu satu
        this.items = this.items.map((item) => {
          // jika bukan barang yang diklik
          if (item.id !== id) {
            return item;
          } else {
            item.quantity--;
            item.total = item.price * item.quantity;
            this.quantity--;
            this.total -= item.price;
            return item;
          }
        });
      } else if (cartItem.quantity === 1) {
        // jika barang sisa satu
        this.items = this.items.filter((item) => item.id !== id);
        this.quantity--;
        this.total -= cartItem.price;
        return item;
      }
    },
  });
});

// Form validation
const checkoutButton = document.querySelector(".checkout-button");
checkoutButton.disabled = true;

const form = document.querySelector("#checkoutForm");
form.addEventListener("keyup", function () {
  for (let i = 0; i < form.elements.length; i++) {
    if (form.elements[i].value.length !== 0) {
      checkoutButton.classList.remove("disabled");
      checkoutButton.classList.add("disabled");
    } else {
      return false;
    }
  }
  checkoutButton.disabled = false;
  checkoutButton.classList.remove("disabled");
});

// kirim data ketika tombol checkout diklik
checkoutButton.addEventListener("click", async function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const data = new URLSearchParams(formData);
  const objData = Object.fromEntries(data);
  const message = formatMessage(objData);
  // window.open('http://wa.me/use your WA number?text=' + encodeURIComponent(message))

  // Minta transaksi token menggunakan ajax/fetch
  try {
    const response = await fetch("php/order.php", {
      method: "POST",
      body: data,
    });
    const token = await response.text();
    // console.log(token);
    window.snap.pay(token);
  } catch (err) {
    console.log(err.message);
  }


});

// Format pesan whatsapp
const formatMessage = (obj) => {
  return `Data Customer
  Nama: ${obj.name}
  Email: ${obj.email}
  No Hp: ${obj.phone}
Data Pesanan
  ${JSON.parse(obj.items).map((item) => `${item.name} (${item.quantity} * ${rupiah(item.total)}) \n`)}
  TOTAL: ${rupiah(obj.total)}
  Terima Kasih.`;
};

// konversi ke rupiah
const rupiah = (number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(number);
};
