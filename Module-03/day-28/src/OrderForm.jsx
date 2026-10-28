import { useState } from "react";
import PropTypes from "prop-types";

export function OrderForm({ total }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "Bole",
  });

  // TeleBirr phone validation rule: accepts +2519... or 09... followed by 8 digits
  const isPhoneValid = /^(?:\+2519|09)\d{8}$/.test(form.phone);

  function handleChange(e) {
    const { name, value } = e.target;
    // Copy existing form state and override only the changed field
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!isPhoneValid) return;

    alert(
      `Order submitted!\nName: ${form.name}\nArea: ${form.area}\nTotal: ${total} ETB`
    );
  }

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h3>Delivery Details</h3>

      <div className="field">
        <label htmlFor="name">Name:</label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          placeholder="Your name"
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
          <p className="err">Invalid TeleBirr number (use 09... or +2519...)</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="area">Delivery Area:</label>
        <select id="area" name="area" value={form.area} onChange={handleChange}>
          <option value="Bole">Bole</option>
          <option value="Kazanchis">Kazanchis</option>
          <option value="Piassa">Piassa</option>
          <option value="Sarbet">Sarbet</option>
        </select>
      </div>

      <button type="submit" disabled={!isPhoneValid || !form.name || total === 0}>
        Pay {total} ETB with TeleBirr
      </button>
    </form>
  );
}

OrderForm.propTypes = {
  total: PropTypes.number.isRequired,
};