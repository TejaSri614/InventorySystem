import React from "react";

const LowStockTable = ({ items }) => {
  if (items.length === 0) {
    return <p className="text-center mt-4 text-green-600">All products are sufficiently stocked.</p>;
  }
    return (
    <div className="overflow-x-auto mt-4">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
            <th className="px-4 py-2 border">Id</th>
            <th className="px-4 py-2 border">Image</th>
            <th className="px-4 py-2 border">Name</th>
            <th className="px-4 py-2 border">Stock</th>
            <th className="px-4 py-2 border">minStock</th>
            <th className="px-4 py-2 border">category</th>
        </thead>
        <tbody>
            {items.map((product) => (
                <tr key={product._id} className="text-center">
                  <td>{product.productId}</td>
                  <td className="border px-4 py-2">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-12 w-12 object-cover mx-auto rounded"
                      />
                    ) : (
                      <span className="text-gray-400">No image</span>
                    )}
                    </td>
                    <td className="border px-4 py-2">{product.name}</td>
                    <td className="border px-4 py-2">{product.stockAvailable}</td>
                    <td className="border px-4 py-2">{product.minStock}</td>
                    {/* <td className="border px-4 py-2">{product.price}</td> */}
                    <td className="border px-4 py-2">{product.category}</td>
                </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default LowStockTable;