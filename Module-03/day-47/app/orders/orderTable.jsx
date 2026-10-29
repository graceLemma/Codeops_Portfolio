export default function OrderTable({ orders }) {
  return (
    <table>
      <caption>Your orders, most recent first</caption>
      <thead>
        <tr>
          <th scope="col">Order</th>
          <th scope="col">Total</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((o) => (
          <tr key={o.id}>
            <td>{o.id}</td>
            <td>{etb(o.total)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}