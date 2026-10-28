import { useState } from "react";
import PropTypes from "prop-types";

export function OrderForm({ total }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Bole",
  });

  // Validates TeleBirr numbers starting with +2519 or 09 followed by 8 digits
  const isPhoneValid = /^(?:\+2519|09)\d{8}$/.test(form.phone);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isPhoneValid) return;

    alert(
      `Order Confirmed!\nCustomer: ${form.name}\nArea: ${form.area}\nTotal Paid: ${total} ETB`
    );
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h3>Delivery Information</h3>

      <div className="field">
        <label htmlFor="name">Full Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Abebe Bikila"
          required
        />
      </div>

      <div className="field">
        <label htmlFor="phone">TeleBirr Phone Number:</label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="0911223344 or +251911223344"
          required
        />
        {form.phone && !isPhoneValid && (
          <p className="err">Use format: 09... or +2519... (10 or 13 digits)</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="area">Area:</label>
        <select id="area" name="area" value={form.area} onChange={handleChange}>
          <option value="Bole">Bole</option>
          <option value="Kazanchis">Kazanchis</option>
          <option value="Piassa">Piassa</option>
          <option value="Sarbet">Sarbet</option>
        </select>
      </div>

      <button type="submit" disabled={!isPhoneValid || !form.name || total === 0}>
        Pay {total} ETB via TeleBirr
      </button>
    </form>
  );
}

OrderForm.propTypes = {
  total: PropTypes.number.isRequired,
};