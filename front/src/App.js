import React, { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Link, Route, Routes, useParams } from "react-router-dom";
import { api } from "./api";
import { translations } from "./locales";
import "./style.css";
import mainImage from "./Главная.jpg";
import cupcakeImage from "./Капкейки.jpg";
import cheesecakeImage from "./Чизкейки.jpg";
import cakeImage from "./Картиночка.jpg";

const productImages = {
  cupcake: cupcakeImage,
  cheesecake: cheesecakeImage,
  cake: cakeImage,
};

const emptyProduct = {
  translations: {
    ru: { name: "", description: "" },
    en: { name: "", description: "" },
  },
  price: 1,
  count: 1,
  image: "cupcake",
  tags: [],
};

function Header({ t, me, onLogout }) {
  return (
    <header className="app-header">
      <Link to="/" className="brand">
        {t.brand}
      </Link>
      <nav>
        <Link to="/">{t.navHome}</Link>
        <Link to="/catalog">{t.navCatalog}</Link>
        {me.user?.role === "admin" && <Link to="/admin">{t.navAdmin}</Link>}
      </nav>
      <div className="user-chip">
        {t.currentRole}: {t[me.user?.role || "guest"]}
        {me.authenticated && (
          <button type="button" onClick={onLogout}>
            {t.logout}
          </button>
        )}
      </div>
    </header>
  );
}

function LocaleBanner({ t, onChoose }) {
  if (sessionStorage.getItem("locale-confirmed") === "true") {
    return null;
  }

  return (
    <div className="locale-banner">
      <span>{t.localeQuestion}</span>
      <button type="button" onClick={() => onChoose("ru")}>
        {t.localeRu}
      </button>
      <button type="button" onClick={() => onChoose("en")}>
        {t.localeEn}
      </button>
    </div>
  );
}

function AuthPanel({ t, refreshMe }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    try {
      if (mode === "login") {
        await api.login(form);
      } else {
        await api.register(form);
      }
      setForm({ username: "", password: "" });
      await refreshMe();
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <form className="auth-panel" onSubmit={submit}>
      <div className="segmented">
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
          {t.login}
        </button>
        <button
          type="button"
          className={mode === "register" ? "active" : ""}
          onClick={() => setMode("register")}
        >
          {t.register}
        </button>
      </div>
      <input
        value={form.username}
        onChange={(event) => setForm({ ...form, username: event.target.value })}
        placeholder={t.username}
      />
      <input
        value={form.password}
        onChange={(event) => setForm({ ...form, password: event.target.value })}
        placeholder={t.password}
        type="password"
      />
      <button type="submit">{mode === "login" ? t.login : t.register}</button>
      {message && <p className="form-message">{message}</p>}
    </form>
  );
}

function ProductCard({ product, t, onLike }) {
  return (
    <article className="product-card">
      <img src={productImages[product.image] || cupcakeImage} alt={product.name} />
      <div className="product-body">
        <div className="product-title-row">
          <h3>{product.name}</h3>
          {product.recommended && <span>{t.recommended}</span>}
        </div>
        <p>{product.description}</p>
        <p className="price">
          {product.price} BYN / {product.count}
        </p>
        <p className="rating-line">
          {t.avgRating}: {product.averageRating || "-"} ({product.reviewsCount})
        </p>
        <div className="card-actions">
          <button type="button" onClick={() => onLike(product.id)}>
            {t.like}
          </button>
          <Link to={`/product/${product.id}`}>{t.details}</Link>
        </div>
      </div>
    </article>
  );
}

function Home({ t }) {
  return (
    <main>
      <section className="hero">
        <img src={mainImage} alt="" />
        <div>
          <h1>{t.heroTitle}</h1>
          <p>{t.heroText}</p>
          <Link to="/catalog">{t.heroButton}</Link>
        </div>
      </section>
    </main>
  );
}

function Catalog({ t }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setProducts(await api.getProducts());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function likeProduct(id) {
    await api.likeProduct(id);
    await loadProducts();
  }

  if (loading) {
    return <main className="page">{t.loading}</main>;
  }

  return (
    <main className="page">
      <h1>{t.catalogTitle}</h1>
      <section className="products-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} t={t} onLike={likeProduct} />
        ))}
      </section>
    </main>
  );
}

function ProductPage({ t, me }) {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [review, setReview] = useState({ rating: 5, comment: "" });
  const [message, setMessage] = useState("");

  const loadProduct = useCallback(async () => {
    setProduct(await api.getProduct(id));
  }, [id]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  async function submitReview(event) {
    event.preventDefault();
    setMessage("");

    try {
      await api.addReview(id, { rating: Number(review.rating), comment: review.comment });
      setReview({ rating: 5, comment: "" });
      await loadProduct();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (!product) {
    return <main className="page">{t.loading}</main>;
  }

  return (
    <main className="page product-page">
      <img src={productImages[product.image] || cupcakeImage} alt={product.name} />
      <section>
        <h1>{product.name}</h1>
        <p>{product.description}</p>
        <p className="price">
          {product.price} BYN / {product.count}
        </p>
        <p>
          {t.avgRating}: {product.averageRating || "-"}
        </p>

        {me.authenticated ? (
          <form className="review-form" onSubmit={submitReview}>
            <label>
              {t.rating}
              <input
                type="number"
                min="1"
                max="5"
                value={review.rating}
                onChange={(event) => setReview({ ...review, rating: event.target.value })}
              />
            </label>
            <label>
              {t.comment}
              <textarea
                value={review.comment}
                onChange={(event) => setReview({ ...review, comment: event.target.value })}
              />
            </label>
            <button type="submit">{t.sendReview}</button>
            {message && <p className="form-message">{message}</p>}
          </form>
        ) : (
          <p className="notice">{t.loginToReview}</p>
        )}

        <h2>{t.reviews}</h2>
        {product.reviews.length === 0 && <p>{t.noReviews}</p>}
        {product.reviews.map((item) => (
          <article key={item.id} className="review">
            <strong>
              {item.username} · {item.rating}/5
            </strong>
            <time>{new Date(item.createdAt).toLocaleDateString()}</time>
            <p>{item.comment}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

function AdminPage({ t, me }) {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState("");

  const loadProducts = useCallback(async () => {
    if (me.user?.role === "admin") {
      setProducts(await api.getAdminProducts());
    }
  }, [me.user?.role]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  function chooseProduct(product) {
    setSelectedId(product.id);
    setForm(product);
    setMessage("");
  }

  function updateTranslation(locale, field, value) {
    setForm({
      ...form,
      translations: {
        ...form.translations,
        [locale]: { ...form.translations[locale], [field]: value },
      },
    });
  }

  async function submit(event) {
    event.preventDefault();
    setMessage("");

    const payload = {
      ...form,
      price: Number(form.price),
      count: Number(form.count),
      tags: Array.isArray(form.tags)
        ? form.tags
        : String(form.tags)
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
    };

    try {
      if (selectedId) {
        await api.updateProduct(selectedId, payload);
      } else {
        await api.createProduct(payload);
      }
      setForm(emptyProduct);
      setSelectedId(null);
      await loadProducts();
    } catch (error) {
      setMessage(error.message);
    }
  }

  if (me.user?.role !== "admin") {
    return <main className="page notice">{t.adminOnly}</main>;
  }

  return (
    <main className="page admin-page">
      <section>
        <h1>{t.adminTitle}</h1>
        <div className="admin-list">
          <button type="button" onClick={() => chooseProduct({ ...emptyProduct, id: null })}>
            {t.newProduct}
          </button>
          {products.map((product) => (
            <button key={product.id} type="button" onClick={() => chooseProduct(product)}>
              {product.translations.ru.name}
            </button>
          ))}
        </div>
      </section>

      <form className="admin-form" onSubmit={submit}>
        <h2>{selectedId ? t.edit : t.create}</h2>
        <input
          value={form.translations.ru.name}
          onChange={(event) => updateTranslation("ru", "name", event.target.value)}
          placeholder={t.productRuName}
        />
        <input
          value={form.translations.en.name}
          onChange={(event) => updateTranslation("en", "name", event.target.value)}
          placeholder={t.productEnName}
        />
        <textarea
          value={form.translations.ru.description}
          onChange={(event) => updateTranslation("ru", "description", event.target.value)}
          placeholder={t.productRuDescription}
        />
        <textarea
          value={form.translations.en.description}
          onChange={(event) => updateTranslation("en", "description", event.target.value)}
          placeholder={t.productEnDescription}
        />
        <input
          type="number"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
          placeholder={t.price}
        />
        <input
          type="number"
          value={form.count}
          onChange={(event) => setForm({ ...form, count: event.target.value })}
          placeholder={t.count}
        />
        <select value={form.image} onChange={(event) => setForm({ ...form, image: event.target.value })}>
          <option value="cupcake">cupcake</option>
          <option value="cheesecake">cheesecake</option>
          <option value="cake">cake</option>
        </select>
        <input
          value={Array.isArray(form.tags) ? form.tags.join(", ") : form.tags}
          onChange={(event) => setForm({ ...form, tags: event.target.value })}
          placeholder={t.tags}
        />
        <button type="submit">{t.save}</button>
        {message && <p className="form-message">{message}</p>}
      </form>
    </main>
  );
}

function AppContent() {
  const [locale, setLocale] = useState("ru");
  const [me, setMe] = useState({ authenticated: false, user: null });
  const t = useMemo(() => translations[locale], [locale]);

  const refreshMe = useCallback(async () => {
    setMe(await api.getMe());
  }, []);

  useEffect(() => {
    async function bootstrap() {
      const [localeResponse, meResponse] = await Promise.all([api.getLocale(), api.getMe()]);
      setLocale(localeResponse.locale);
      setMe(meResponse);
    }

    bootstrap();
  }, []);

  async function chooseLocale(nextLocale) {
    const response = await api.setLocale(nextLocale);
    sessionStorage.setItem("locale-confirmed", "true");
    setLocale(response.locale);
  }

  async function logout() {
    await api.logout();
    await refreshMe();
  }

  return (
    <>
      <Header t={t} me={me} onLogout={logout} />
      <LocaleBanner t={t} onChoose={chooseLocale} />
      {!me.authenticated && <AuthPanel t={t} refreshMe={refreshMe} />}
      <Routes>
        <Route path="/" element={<Home t={t} />} />
        <Route path="/catalog" element={<Catalog t={t} />} />
        <Route path="/product/:id" element={<ProductPage t={t} me={me} />} />
        <Route path="/admin" element={<AdminPage t={t} me={me} />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
