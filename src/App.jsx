import { useEffect, useState } from "react";

import Header from "./components/Header.jsx";
import VendorCard from "./components/VendorCard.jsx";
import MenuList from "./components/MenuList.jsx";
import Footer from "./components/Footer.jsx";
import { Loading, ErrorMessage } from "./components/Status.jsx";
import CartPage from "./components/CartPage.jsx";

function App() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  const [selectedVendorId, setSelectedVendorId] = useState(null);
  const [cart, setCart] = useState([]);
  const [view, setView] = useState("menu");
  const [lastOrder, setLastOrder] = useState(null);

  // B2: Fetch vendor data from the mock API.
  useEffect(() => {
    const controller = new AbortController();

    async function fetchVendors() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/vendors.json", {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Invalid vendor data.");
        }

        setVendors(data);

        setSelectedVendorId((currentId) => {
          const exists = data.some((vendor) => vendor.id === currentId);

          return exists ? currentId : (data[0]?.id ?? null);
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchVendors();

    return () => controller.abort();
  }, [reloadKey]);

  const selectedVendor = vendors.find(
    (vendor) => vendor.id === selectedVendorId,
  );

  // B3: Add an item or increase its quantity.
  function handleAddToCart(item) {
    setCart((previousCart) => {
      const existingLine = previousCart.find(
        (line) => line.item.id === item.id,
      );

      if (existingLine) {
        return previousCart.map((line) =>
          line.item.id === item.id ? { ...line, qty: line.qty + 1 } : line,
        );
      }

      return [...previousCart, { item, qty: 1 }];
    });
  }

  // B3: Change quantity. Remove the line when quantity reaches zero.
  function handleChangeQty(itemId, delta) {
    setCart((previousCart) =>
      previousCart
        .map((line) =>
          line.item.id === itemId ? { ...line, qty: line.qty + delta } : line,
        )
        .filter((line) => line.qty > 0),
    );
  }

  // B3: Remove an item from the cart.
  function handleRemove(itemId) {
    setCart((previousCart) =>
      previousCart.filter((line) => line.item.id !== itemId),
    );
  }

  // Derived value: total quantity across all cart lines.
  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0);

  // B5: Save the order, calculate total and clear the cart.
  function handlePlaceOrder(details) {
    const total = cart.reduce(
      (sum, line) => sum + line.item.price * line.qty,
      0,
    );

    setLastOrder({
      ...details,
      total,
    });

    setCart([]);
    setView("done");
  }

  let content;

  if (view === "cart") {
    content = (
      <CartPage
        cart={cart}
        onChangeQty={handleChangeQty}
        onRemove={handleRemove}
        onPlaceOrder={handlePlaceOrder}
      />
    );
  } else if (view === "done") {
    content = (
      <section className="card">
        <h2>Order placed!</h2>

        {lastOrder && (
          <>
            <p>Thank you, {lastOrder.name}.</p>

            <p>Mahallah: {lastOrder.mahallah}</p>

            <p>Pickup time: {lastOrder.pickupTime}</p>

            <p className="price">Total: RM {lastOrder.total.toFixed(2)}</p>
          </>
        )}

        <button type="button" className="btn" onClick={() => setView("menu")}>
          Back to vendors
        </button>
      </section>
    );
  } else if (loading) {
    content = <Loading />;
  } else if (error) {
    content = (
      <ErrorMessage
        message={error}
        onRetry={() => setReloadKey((key) => key + 1)}
      />
    );
  } else {
    content = (
      <>
        <section>
          <h2 className="section-title">Choose a vendor</h2>

          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                isSelected={vendor.id === selectedVendorId}
                onSelect={setSelectedVendorId}
              />
            ))}
          </div>
        </section>

        {selectedVendor && (
          <section>
            <h2 className="section-title">Menu: {selectedVendor.name}</h2>

            <MenuList items={selectedVendor.menu} onAdd={handleAddToCart} />
          </section>
        )}
      </>
    );
  }

  return (
    <>
      <Header
        cartCount={cartCount}
        onShowMenu={() => setView("menu")}
        onShowCart={() => setView("cart")}
      />

      <main className="container">{content}</main>

      <Footer />
    </>
  );
}

export default App;
