// Load customers from localStorage
let customers = JSON.parse(localStorage.getItem("barbershopCustomers")) || [];

// Save to localStorage
function saveCustomers() {
  localStorage.setItem("barbershopCustomers", JSON.stringify(customers));
}

// Add new customer
function addCustomer() {
  const name = document.getElementById("customerName").value.trim();
  const phone = document.getElementById("customerPhone").value.trim();

  if (!name) {
    alert("الرجاء إدخال اسم الزبون");
    return;
  }

  const customer = {
    id: Date.now(),
    name: name,
    phone: phone,
    visits: 0,
    totalVisits: 0,
  };

  customers.push(customer);
  saveCustomers();
  renderCustomers();

  // Clear inputs
  document.getElementById("customerName").value = "";
  document.getElementById("customerPhone").value = "";
}

// Add visit
function addVisit(id) {
  const customer = customers.find((c) => c.id === id);
  if (!customer) return;

  if (customer.visits === 8) {
    // Free haircut!
    alert(`🎉 مبروك! ${customer.name} حصل على حلاقة مجانية!`);
    customer.visits = 0;
  } else {
    customer.visits++;
  }

  customer.totalVisits++;
  saveCustomers();
  renderCustomers();
}

// Delete customer
function deleteCustomer(id) {
  if (confirm("هل أنت متأكد من حذف هذا الزبون؟")) {
    customers = customers.filter((c) => c.id !== id);
    saveCustomers();
    renderCustomers();
  }
}

// Render customers list
function renderCustomers() {
  const container = document.getElementById("customersList");

  if (customers.length === 0) {
    container.innerHTML = `
                <div class="empty-state">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <h3>لا يوجد زبائن بعد</h3>
                    <p>ابدأ بإضافة زبون جديد من الأعلى</p>
                </div>
            `;
    return;
  }

  container.innerHTML = customers
    .map((customer) => {
      const isFreeVisit = customer.visits === 8;

      return `
                <div class="customer-card">
                    <div class="customer-header">
                        <div class="customer-info">
                            <h3>${customer.name}</h3>
                            ${
                              customer.phone
                                ? `<p>📱 ${customer.phone}</p>`
                                : ""
                            }
                            <p>إجمالي مرات الحلاقة: ${customer.totalVisits}</p>
                        </div>
                        ${
                          isFreeVisit
                            ? '<span class="free-badge">🎁 حلاقة مجانية!</span>'
                            : ""
                        }
                    </div>
                    
                    <div class="visits-tracker">
                        ${Array.from({ length: 9 }, (_, i) => {
                          const isCompleted = i < customer.visits;
                          const isFree = i === 8;
                          const circleClass = isFree
                            ? "free"
                            : isCompleted
                            ? "completed"
                            : "";
                          const label = isFree ? "🎁" : i + 1;
                          return `<div class="visit-circle ${circleClass}">${label}</div>`;
                        }).join("")}
                    </div>
                    
                    <div class="customer-actions">
                        <button class="btn-add-visit" onclick="addVisit(${
                          customer.id
                        })">
                            ${
                              isFreeVisit
                                ? "✅ تأكيد الحلاقة المجانية"
                                : "➕ إضافة حلاقة"
                            }
                        </button>
                        <button class="btn-delete" onclick="deleteCustomer(${
                          customer.id
                        })">🗑️</button>
                    </div>
                </div>
            `;
    })
    .join("");
}

// Event listeners setup
function setupEventListeners() {
  // Allow Enter key to add customer
  document
    .getElementById("customerName")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") addCustomer();
    });

  document
    .getElementById("customerPhone")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") addCustomer();
    });
}

// Initialize the application
function init() {
  setupEventListeners();
  renderCustomers();
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
