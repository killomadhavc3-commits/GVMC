import { useEffect, useState } from "react";
import { Link, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  BarChart3,
  CheckCircle2,
  CircleHelp,
  Clock3,
  Leaf,
  LogOut,
  MapPin,
  Menu,
  Recycle,
  RefreshCw,
  Send,
  ShieldCheck,
  Sparkles,
  Trash2,
  Truck,
  Users,
  Wallet,
  X
} from "lucide-react";
import { api } from "./api.js";

const phases = [
  { number: "01", title: "MERN foundation and secure accounts", detail: "The responsive React website connects to an Express and Node.js API with MongoDB persistence. Residents can register, sign in with a secure session, and access a role-aware profile.", image: "/images/vizag-cityscape.jpg", status: "Available", statusType: "available" },
  { number: "02", title: "Waste segregation guide", detail: "Residents can browse practical wet, dry, hazardous and sanitary waste guidance and search for common items. Photo-based AI classification and locally verified, ward-specific advice are future enhancements.", image: "/images/segregation-bins.jpg", status: "In progress", statusType: "progress" },
  { number: "03", title: "Resident pickup requests", detail: "Residents can choose a waste stream, address and preferred date, add collection instructions, review request status and cancel eligible requests. Pickup records are saved to MongoDB.", image: "/images/collection-truck.jpg", status: "Available", statusType: "available" },
  { number: "04", title: "Collection agent workspace", detail: "The API supports admin assignment of pickups to collection agents and authorized status updates. A dedicated agent dashboard for daily work lists and shift management remains to be built.", image: "/images/collection-truck.jpg", status: "API ready", statusType: "api" },
  { number: "05", title: "Routes and live collection updates", detail: "Planned route planning will group assigned stops into practical collection runs. Live agent location and pickup progress will help residents follow a collection; real-time tracking is not available yet.", image: "/images/vizag-cityscape.jpg", status: "Planned", statusType: "planned" },
  { number: "06", title: "Resident rewards and history", detail: "The resident workspace shows a points wallet and completed-pickup history, currently awarding 10 points per completed pickup. Verified rewards specifically for correct segregation are a future extension.", image: "/images/recycling-worker.jpg", status: "Available", statusType: "available" },
  { number: "07", title: "Complaints and service requests", detail: "Residents can submit reports about missed pickups, overflowing bins, illegal dumping or other issues and follow their status. Municipal staff status updates are supported by the API.", image: "/images/gvmc-home-background.jpg", status: "Available", statusType: "available" },
  { number: "08", title: "Municipal administration", detail: "Planned admin tools will manage service zones and staff, coordinate operational notices, and summarize pickups and reports with city-level analytics. Staff onboarding and zone-management screens are not available yet.", image: "/images/vizag-cityscape.jpg", status: "Planned", statusType: "planned" },
  { number: "09", title: "Recycling marketplace", detail: "The API supports recyclable-material listings and buyer inquiries to help connect bulk sellers with recycling centers. Seller and buyer screens are not connected yet; payments and shipping are outside the first release.", image: "/images/recycling-worker.jpg", status: "API ready", statusType: "api" },
  { number: "10", title: "Testing, launch and city pilot", detail: "Before a city pilot, the platform needs accessibility, integration, performance and security testing, plus production deployment, monitoring and support plans agreed with participating local services.", image: "/images/gvmc-home-background.jpg", status: "Planned", statusType: "planned" }
];

const roleNames = {
  resident: "Resident",
  collectionAgent: "Collection agent",
  municipalAdmin: "Municipal admin",
  recyclingBuyer: "Recycling buyer"
};

function Brand({ compact = false }) {
  return (
    <Link to="/" className={`brand${compact ? " brand-compact" : ""}`}>
      <img className="brand-mark brand-image" src="/images/gvmc-seal.jpg" alt="" />
      <span className="brand-copy"><strong>GVMC</strong><small>WASTE SEGREGATION GUIDE</small></span>
    </Link>
  );
}

function Header({ user, onSignOut }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const isCurrent = (to) => {
    const [path, hash] = to.split("#");
    if (location.pathname !== (path || "/")) return false;
    return hash ? (location.hash || "#top") === `#${hash}` : true;
  };
  const dashboardPath = user ? "/dashboard" : "/login";
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand />
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link className={isCurrent("/#top") ? "is-active" : undefined} aria-current={isCurrent("/#top") ? "page" : undefined} to="/#top"><span className="nav-emoji" aria-hidden="true">🏠</span>Home</Link>
          <Link className={isCurrent("/#about") ? "is-active" : undefined} aria-current={isCurrent("/#about") ? "page" : undefined} to="/#about"><span className="nav-emoji" aria-hidden="true">ℹ️</span>About Us</Link>
          <Link className={isCurrent("/#segregation") ? "is-active" : undefined} aria-current={isCurrent("/#segregation") ? "page" : undefined} to="/#segregation"><span className="nav-emoji" aria-hidden="true">♻️</span>Waste Segregation</Link>
          <Link className={isCurrent("/#services") ? "is-active" : undefined} aria-current={isCurrent("/#services") ? "page" : undefined} to="/#services"><span className="nav-emoji" aria-hidden="true">🛠️</span>Services</Link>
          <Link className={isCurrent("/#recycling") ? "is-active" : undefined} aria-current={isCurrent("/#recycling") ? "page" : undefined} to="/#recycling"><span className="nav-emoji" aria-hidden="true">🌱</span>Recycling</Link>
          <Link className={isCurrent(dashboardPath) ? "is-active" : undefined} aria-current={isCurrent(dashboardPath) ? "page" : undefined} to={dashboardPath}><span className="nav-emoji" aria-hidden="true">📊</span>Dashboard</Link>
          <Link className={isCurrent("/#contact") ? "is-active" : undefined} aria-current={isCurrent("/#contact") ? "page" : undefined} to="/#contact"><span className="nav-emoji" aria-hidden="true">📞</span>Contact</Link>
        </nav>
        <div className="header-actions">
          {user ? (
            <div className="account-menu">
              <span className="avatar">{user.name?.charAt(0).toUpperCase()}</span>
              <span className="account-name">{user.name}</span>
              <button className="icon-button" onClick={onSignOut} aria-label="Sign out" title="Sign out"><LogOut size={17} /></button>
            </div>
          ) : (
            <Link className="button button-dark button-small" to="/login"><Users size={15} /> Login / Register</Link>
          )}
          <button className="icon-button mobile-menu" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {menuOpen && <nav className="mobile-nav" id="mobile-navigation" aria-label="Mobile navigation">
        <Link className={isCurrent("/#top") ? "is-active" : undefined} aria-current={isCurrent("/#top") ? "page" : undefined} to="/#top" onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">🏠</span>Home</Link>
        <Link className={isCurrent("/#about") ? "is-active" : undefined} aria-current={isCurrent("/#about") ? "page" : undefined} to="/#about" onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">ℹ️</span>About Us</Link>
        <Link className={isCurrent("/#segregation") ? "is-active" : undefined} aria-current={isCurrent("/#segregation") ? "page" : undefined} to="/#segregation" onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">♻️</span>Waste Segregation</Link>
        <Link className={isCurrent("/#services") ? "is-active" : undefined} aria-current={isCurrent("/#services") ? "page" : undefined} to="/#services" onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">🛠️</span>Services</Link>
        <Link className={isCurrent("/#recycling") ? "is-active" : undefined} aria-current={isCurrent("/#recycling") ? "page" : undefined} to="/#recycling" onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">🌱</span>Recycling</Link>
        <Link className={isCurrent(dashboardPath) ? "is-active" : undefined} aria-current={isCurrent(dashboardPath) ? "page" : undefined} to={dashboardPath} onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">📊</span>Dashboard</Link>
        <Link className={isCurrent("/#contact") ? "is-active" : undefined} aria-current={isCurrent("/#contact") ? "page" : undefined} to="/#contact" onClick={() => setMenuOpen(false)}><span className="nav-emoji" aria-hidden="true">📞</span>Contact</Link>
        {!user && <Link to="/login" onClick={() => setMenuOpen(false)}>Login / Register</Link>}
      </nav>}
    </header>
  );
}

function Home({ user }) {
  return (
    <main id="top">
      <section className="hero page-wrap">
        <div className="hero-banner">
          <img
            className="hero-photo"
            src="/images/gvmc-home-background.jpg"
            alt="Visakhapatnam waste segregation platform, collection services, recycling center and municipal dashboard."
            loading="eager"
          />
        </div>
      </section>

      <section id="about" className="intro-section about-section">
        <div className="about-equipment" aria-hidden="true">
          <span className="about-equipment-icon about-equipment-truck"><Truck size={28} strokeWidth={1.7} /></span>
          <span className="about-equipment-icon about-equipment-recycle"><Recycle size={27} strokeWidth={1.7} /></span>
          <span className="about-equipment-icon about-equipment-bin"><Trash2 size={25} strokeWidth={1.7} /></span>
          <span className="about-equipment-icon about-equipment-leaf"><Leaf size={25} strokeWidth={1.7} /></span>
        </div>
        <div className="page-wrap intro-inner about-layout">
          <div className="section-kicker">About the smart community platform</div>
          <h2>Cleaner neighborhoods start at home.<br /><span>Better city services bring us together.</span></h2>
          <div className="about-story">
            <p className="about-lead">The GVMC Smart Community Recycling &amp; Waste-Segregation Platform is a digital concept for connecting residents, collection teams and municipal coordinators around one shared goal: cleaner streets and responsible recovery of recyclable materials across Visakhapatnam.</p>
            <p>It is designed to make everyday waste decisions easier and local services more visible. Residents can use practical segregation guidance, request household pickups, follow request updates, earn points for completed collections and report neighborhood issues. Collection agents and municipal teams are planned to receive tools for organizing work, managing service areas and understanding local needs through operational insights.</p>
            <p>The platform is being developed in phases. The current release includes resident accounts, a searchable waste guide, pickup requests, reward history and service reports. Photo-assisted classification, live route tracking, notifications, municipal analytics, zone management and the bulk recycling marketplace are planned additions—not active services yet. This community project is independent and is not an official GVMC service.</p>
          </div>
          <div className="about-pillars" aria-label="Platform goals">
            <article><span>01</span><strong>Segregate at source</strong><p>Help households keep biodegradable, recyclable and domestic hazardous waste separate.</p></article>
            <article><span>02</span><strong>Make collection clearer</strong><p>Bring pickup requests, service reports and collection progress into one resident workspace.</p></article>
            <article><span>03</span><strong>Recover more material</strong><p>Encourage reuse and recycling, with a marketplace planned to connect bulk sellers and recycling centers.</p></article>
          </div>
          <div className="value-grid">
            <article className="value-card">
              <figure className="value-image-wrap">
                <img src="/images/segregation-bins.jpg" alt="Separate recycling bins for different household waste streams in a green urban setting" loading="lazy" />
                <figcaption><a href="https://commons.wikimedia.org/wiki/File:Sorted_waste_containers_at_Seocho-gu,_Seoul_01.jpg" target="_blank" rel="noreferrer">Photo: Exj · CC BY-SA 4.0</a></figcaption>
              </figure>
              <span className="value-icon mint"><Sparkles size={20} /></span><h3>Know what goes where</h3><p>Get clear, practical guidance to sort common household waste the right way.</p>
            </article>
            <article id="services" className="value-card">
              <figure className="value-image-wrap">
                <img src="/images/collection-truck.jpg" alt="Municipal collection crew member loading a waste truck on a city street" loading="lazy" />
                <figcaption><a href="https://commons.wikimedia.org/wiki/File:Garbage_truck_in_Geneva.jpg" target="_blank" rel="noreferrer">Photo: Unnerving duck · CC BY-SA 4.0</a></figcaption>
              </figure>
              <span className="value-icon butter"><Truck size={20} /></span><h3>Collections you can follow</h3><p>Request a pickup and keep track of your collection as the service grows.</p>
            </article>
            <article className="value-card">
              <figure className="value-image-wrap">
                <img src="/images/recycling-worker.jpg" alt="Worker sorting recyclable plastic bottles into collection sacks" loading="lazy" />
                <figcaption><a href="https://commons.wikimedia.org/wiki/File:DFC_4507_A_worker_sorting_recyclable_plastic_bottles_into_large_collection_sacks_along_a_quiet_urban_street.jpg" target="_blank" rel="noreferrer">Photo: PattayaPatrol · CC BY-SA 4.0</a></figcaption>
              </figure>
              <span className="value-icon lilac"><Leaf size={20} /></span><h3>Make good habits count</h3><p>Earn recognition for responsible segregation and give recyclables another life.</p>
            </article>
          </div>
        </div>
      </section>

      <section id="segregation" className="segregation-section">
        <div className="page-wrap segregation-inner">
          <div className="section-kicker">Household source segregation</div>
          <h2>Keep these <span>three streams separate.</span></h2>
          <p className="segregation-intro">India’s Solid Waste Management Rules, 2016 require waste generators to separate biodegradable, non-biodegradable and domestic hazardous waste. Use separate, clearly marked containers and follow GVMC or your ward’s current collection instructions. The national rules define waste streams, not a universal bin-colour code.</p>
          <div className="segregation-grid">
            <article className="segregation-card wet-card">
              <img className="segregation-photo" src="/images/segregation-bins.jpg" alt="Separate containers for household waste" loading="lazy" />
              <span className="stream-label">STREAM 01 · BIODEGRADABLE</span>
              <h3>Wet waste</h3>
              <p>Food scraps, fruit and vegetable peels, tea leaves, eggshells, flowers and garden trimmings.</p>
              <strong>Keep it separate</strong>
              <small>Drain excess liquid. Compost at home where practical.</small>
            </article>
            <article className="segregation-card dry-card">
              <img className="segregation-photo" src="/images/recycling-worker.jpg" alt="Recyclable materials being sorted for reuse" loading="lazy" />
              <span className="stream-label">STREAM 02 · NON-BIODEGRADABLE</span>
              <h3>Dry waste</h3>
              <p>Clean paper and cardboard, packaging, plastics, glass and metal items.</p>
              <strong>Keep it clean and dry</strong>
              <small>Empty containers; keep food-soiled material out of recyclables.</small>
            </article>
            <article className="segregation-card hazardous-card">
              <img className="segregation-photo" src="/images/collection-truck.jpg" alt="Municipal waste collection vehicle" loading="lazy" />
              <span className="stream-label">STREAM 03 · DOMESTIC HAZARDOUS</span>
              <h3>Household hazardous</h3>
              <p>Used batteries, CFL or tube lights, expired medicines, paint or pesticide containers, broken thermometers and used needles or syringes.</p>
              <strong>Do not mix with regular waste</strong>
              <small>Do not open containers or handle loose sharps. Store securely and hand over as GVMC directs.</small>
            </article>
          </div>
          <aside className="sanitary-guidance">
            <span className="sanitary-icon"><ShieldCheck size={19} /></span>
            <p><strong>Sanitary waste:</strong> securely wrap used diapers, sanitary pads and similar waste before handing it to the waste collector, as required by the rules. Follow GVMC’s local handover instructions.</p>
          </aside>
          <div className="segregation-sources">
            <span>Check the current ward-level instructions before collection.</span>
            <a href="https://www.gvmc.gov.in/Citizen%20Services.htm" target="_blank" rel="noreferrer">GVMC Citizen Services <ArrowUpRight size={14} /></a>
            <a href="https://cpcb.nic.in/uploads/MSW/SWM_2016.pdf" target="_blank" rel="noreferrer">Solid Waste Management Rules, 2016 (CPCB) <ArrowUpRight size={14} /></a>
          </div>
        </div>
      </section>

      <section id="roadmap" className="roadmap-section page-wrap">
        <div className="roadmap-heading"><div><div className="section-kicker">A 10-phase MERN roadmap</div><h2>Small steps.<br /><span>Lasting change.</span></h2></div><p>See what residents, collection agents and municipal teams can use today—and what is still being built. Available features are live in this project; API-ready items do not yet have a connected screen.</p></div>
        <div className="phase-list">{phases.map(({ number, title, detail, image, status, statusType }) => <article className={`phase-row${statusType === "progress" ? " phase-current" : ""}`} key={number}><span className="phase-number">{number}</span><a className="phase-icon" href={image} target="_blank" rel="noreferrer" aria-label={`Open the ${title} image in a new tab`}><img src={image} alt="" loading="lazy" /></a><div className="phase-info"><h3>{title}</h3><p>{detail}</p></div><span className={`phase-status status-${statusType}`}><span />{status}</span><ArrowUpRight className="phase-arrow" size={18} /></article>)}</div>
        <div id="recycling" className="marketplace-note"><span className="market-icon"><Recycle size={19} /></span><p><strong>Coming in phase 9: the recycling marketplace.</strong> Bulk listings connect households and local sellers with recycling-center buyers. The first release will focus on listings and inquiries.</p><ArrowRight size={18} /></div>
      </section>
      <section id="contact" className="contact-section">
        <div className="page-wrap contact-inner">
          <div>
            <div className="section-kicker">Contact &amp; support</div>
            <h2>Need help with a city service?</h2>
            <p>For official municipal information, visit GVMC Citizen Services. To report a neighborhood issue through this community platform, use the service-report form in your resident workspace.</p>
          </div>
          <div className="contact-actions">
            <a className="button button-green" href="https://www.gvmc.gov.in/Citizen%20Services.htm" target="_blank" rel="noreferrer">
              GVMC Citizen Services <ArrowUpRight size={16} />
            </a>
            <Link className="button button-outline" to={user ? "/dashboard" : "/login"}>
              {user ? "Open service reports" : "Sign in to report an issue"} <ArrowRight size={16} />
            </Link>
          </div>
          <p className="contact-disclaimer">This is an independent community project, not an official GVMC service. For urgent or official assistance, contact GVMC through its official channels.</p>
        </div>
      </section>
      <footer className="site-footer"><div className="page-wrap footer-inner"><Brand compact /><span>Thoughtful waste management, built together.</span><span>Independent community guide · Not an official GVMC service</span></div></footer>
    </main>
  );
}

function AuthPage({ mode, onAuthenticated }) {
  const isRegister = mode === "register";
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  async function submit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const { data } = await api.post(`/auth/${isRegister ? "register" : "login"}`, form);
      onAuthenticated(data.user);
      navigate("/dashboard");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not connect to CleanCity. Check that the API is running.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page page-wrap">
      <div className="auth-card">
        <Link to="/" className="auth-back"><ArrowRight size={15} className="back-arrow" /> Back to home</Link>
        <div className="auth-symbol"><Leaf size={22} /></div>
        <div className="section-kicker">{isRegister ? "Your neighborhood, together" : "Welcome back"}</div>
        <h1>{isRegister ? "Let’s make a difference." : "Good to have you back."}</h1>
        <p className="auth-subtitle">{isRegister ? "Create your resident account to join a cleaner community." : "Sign in to continue to your CleanCity workspace."}</p>
        <form onSubmit={submit} className="auth-form">
          {isRegister && <label>Your name<input autoComplete="name" required minLength={2} maxLength={80} placeholder="e.g. Ananya Rao" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} /></label>}
          <label>Email address<input type="email" autoComplete="email" required placeholder="you@example.com" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} /></label>
          <label>Password<input type="password" autoComplete={isRegister ? "new-password" : "current-password"} required minLength={isRegister ? 10 : undefined} maxLength={72} placeholder={isRegister ? "At least 10 characters" : "Your password"} value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} /></label>
          {error && <div className="form-error" role="alert">{error}</div>}
          <button className="button button-green auth-submit" disabled={busy}>{busy ? "One moment…" : isRegister ? "Create resident account" : "Sign in"} <ArrowRight size={17} /></button>
        </form>
        <p className="auth-switch">{isRegister ? "Already part of the community?" : "New to CleanCity?"} <Link to={isRegister ? "/login" : "/register"}>{isRegister ? "Sign in" : "Create an account"}</Link></p>
        {isRegister && <p className="auth-note"><ShieldCheck size={15} /> Resident accounts are open for registration. Staff accounts are provisioned by the municipality.</p>}
      </div>
      <div className="auth-side"><div className="auth-side-art"><img className="auth-photo" src="/images/collection-truck.jpg" alt="Municipal collection crew at work in the city" /><div className="auth-photo-overlay" /><div className="auth-art-caption"><span>01 / COMMUNITY</span><strong>A cleaner city<br />grows together.</strong></div></div></div>
    </main>
  );
}

function Dashboard({ user, onSignOut }) {
  if (user.role === "resident") return <ResidentDashboard user={user} onSignOut={onSignOut} />;

  const firstName = user.name?.split(" ")[0] || "there";
  return (
    <main className="dashboard page-wrap">
      <div className="dashboard-top"><div><div className="section-kicker">Your CleanCity workspace · {roleNames[user.role] || "Member"}</div><h1>Hello, {firstName}<span className="greeting-dot">.</span></h1><p className="dashboard-subtitle">This is the start of a cleaner, more connected neighborhood.</p></div><button className="button button-outline" onClick={onSignOut}><LogOut size={16} /> Sign out</button></div>
      <div className="dashboard-banner"><img className="dashboard-banner-photo" src="/images/vizag-cityscape.jpg" alt="Visakhapatnam city" /><div className="dashboard-banner-copy"><span className="banner-label">WELCOME TO PHASE 1</span><h2>Your community starts here.</h2><p>We’re laying the foundations for smarter waste services. Useful neighborhood tools are coming in the next phases.</p></div></div>
      <div className="dashboard-grid">
        <article className="dash-card account-card"><div className="dash-card-head"><img className="dash-photo" src="/images/vizag-cityscape.jpg" alt="Visakhapatnam city" /><span className="card-chip">YOUR ACCOUNT</span></div><h3>Your CleanCity profile</h3><dl><div><dt>Name</dt><dd>{user.name}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Workspace</dt><dd>{roleNames[user.role] || "Member"}</dd></div></dl><div className="account-foot"><ShieldCheck size={15} /> Your account is securely signed in</div></article>
        <article className="dash-card next-card"><div className="dash-card-head"><img className="dash-photo" src="/images/segregation-bins.jpg" alt="Household recycling containers" /><span className="card-chip">UP NEXT</span></div><h3>Waste sorting guidance</h3><p>Get straightforward answers on how to sort the everyday waste in your home.</p><span className="coming-label"><span /> Coming in phase 2</span></article>
        <article className="dash-card service-card"><div className="dash-card-head"><img className="dash-photo" src="/images/collection-truck.jpg" alt="Municipal collection vehicle" /><span className="card-chip">ON THE ROADMAP</span></div><h3>Pickups, points &amp; more</h3><p>Pickup scheduling, agent tracking, a rewards wallet and city services will roll out across the 10-phase roadmap.</p><Link to="/#roadmap" className="card-link">Explore the roadmap <ArrowRight size={15} /></Link></article>
      </div>
      <div className="dashboard-footer-note"><CircleHelp size={16} /><span>Need help? Your municipality will share local support contacts as your CleanCity service launches.</span></div>
    </main>
  );
}

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function ResidentDashboard({ user, onSignOut }) {
  const [pickups, setPickups] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [rewardHistory, setRewardHistory] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [guide, setGuide] = useState([]);
  const [guideQuery, setGuideQuery] = useState("");
  const [pageError, setPageError] = useState("");
  const [pickupMessage, setPickupMessage] = useState("");
  const [complaintMessage, setComplaintMessage] = useState("");
  const [pickupBusy, setPickupBusy] = useState(false);
  const [complaintBusy, setComplaintBusy] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pickupForm, setPickupForm] = useState({
    wasteType: "dry",
    address: "",
    ward: "",
    scheduledDate: localDateString(),
    notes: ""
  });
  const [complaintForm, setComplaintForm] = useState({
    category: "missed_pickup",
    description: "",
    location: ""
  });
  const firstName = user.name?.split(" ")[0] || "there";

  async function loadWorkspace() {
    setRefreshing(true);
    setPageError("");
    try {
      const [pickupResponse, walletResponse, historyResponse, complaintResponse, guideResponse] = await Promise.all([
        api.get("/pickups"),
        api.get("/rewards/wallet"),
        api.get("/rewards/history"),
        api.get("/complaints"),
        api.get("/waste/guide")
      ]);
      setPickups(pickupResponse.data.pickups);
      setWallet(walletResponse.data);
      setRewardHistory(historyResponse.data.history);
      setComplaints(complaintResponse.data.complaints);
      setGuide(guideResponse.data.guide);
    } catch (error) {
      setPageError(error.response?.data?.message || "Could not load your CleanCity workspace. Please try again.");
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadWorkspace();
  }, []);

  async function submitPickup(event) {
    event.preventDefault();
    setPickupBusy(true);
    setPickupMessage("");
    try {
      await api.post("/pickups", pickupForm);
      setPickupMessage("Pickup requested. You can follow its status below.");
      setPickupForm({ wasteType: "dry", address: "", ward: "", scheduledDate: localDateString(), notes: "" });
      await loadWorkspace();
    } catch (error) {
      setPickupMessage(error.response?.data?.message || "Could not submit your pickup request.");
    } finally {
      setPickupBusy(false);
    }
  }

  async function cancelPickup(pickupId) {
    setPickupMessage("");
    try {
      await api.patch(`/pickups/${pickupId}/status`, { status: "cancelled" });
      setPickupMessage("Pickup request cancelled.");
      await loadWorkspace();
    } catch (error) {
      setPickupMessage(error.response?.data?.message || "Could not cancel this pickup request.");
    }
  }

  async function submitComplaint(event) {
    event.preventDefault();
    setComplaintBusy(true);
    setComplaintMessage("");
    try {
      await api.post("/complaints", complaintForm);
      setComplaintMessage("Your report has been submitted.");
      setComplaintForm({ category: "missed_pickup", description: "", location: "" });
      await loadWorkspace();
    } catch (error) {
      setComplaintMessage(error.response?.data?.message || "Could not submit your report.");
    } finally {
      setComplaintBusy(false);
    }
  }

  async function searchGuide(event) {
    event.preventDefault();
    try {
      const { data } = await api.get("/waste/guide", { params: { q: guideQuery } });
      setGuide(data.guide);
      setPageError("");
    } catch (error) {
      setPageError(error.response?.data?.message || "Could not search the waste guide.");
    }
  }

  return (
    <main className="dashboard page-wrap resident-workspace">
      <div className="dashboard-top">
        <div>
          <div className="section-kicker">Your CleanCity workspace · Resident</div>
          <h1>Hello, {firstName}<span className="greeting-dot">.</span></h1>
          <p className="dashboard-subtitle">Request collections, check your points and get local sorting guidance.</p>
        </div>
        <div className="workspace-actions">
          <button className="button button-outline" onClick={loadWorkspace} disabled={refreshing}>
            <RefreshCw size={15} /> {refreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button className="button button-outline" onClick={onSignOut}><LogOut size={16} /> Sign out</button>
        </div>
      </div>

      {pageError && <div className="workspace-alert" role="alert">{pageError}</div>}

      <section className="resident-stats" aria-label="Resident summary">
        <article className="resident-stat"><span className="stat-icon"><Truck size={18} /></span><div><strong>{pickups.length}</strong><span>Pickup requests</span></div></article>
        <article className="resident-stat"><span className="stat-icon"><Wallet size={18} /></span><div><strong>{wallet?.points ?? "—"}</strong><span>Reward points</span></div></article>
        <article className="resident-stat"><span className="stat-icon"><CircleHelp size={18} /></span><div><strong>{complaints.length}</strong><span>Reports submitted</span></div></article>
      </section>

      <div className="resident-workspace-grid">
        <section className="workspace-panel">
          <div className="workspace-heading"><div><div className="section-kicker">Collection service</div><h2>Schedule a pickup</h2></div><CalendarDays size={20} /></div>
          <form className="workspace-form" onSubmit={submitPickup}>
            <label>Waste type
              <select value={pickupForm.wasteType} onChange={(event) => setPickupForm({ ...pickupForm, wasteType: event.target.value })}>
                <option value="wet">Wet waste</option><option value="dry">Dry waste</option><option value="hazardous">Hazardous waste</option>
              </select>
            </label>
            <label>Collection address<input required minLength={5} maxLength={300} value={pickupForm.address} onChange={(event) => setPickupForm({ ...pickupForm, address: event.target.value })} placeholder="House number, street and area" /></label>
            <div className="workspace-form-row">
              <label>Ward<input maxLength={80} value={pickupForm.ward} onChange={(event) => setPickupForm({ ...pickupForm, ward: event.target.value })} placeholder="Ward number or name" /></label>
              <label>Preferred date<input type="date" required min={localDateString()} value={pickupForm.scheduledDate} onChange={(event) => setPickupForm({ ...pickupForm, scheduledDate: event.target.value })} /></label>
            </div>
            <label>Instructions (optional)<textarea maxLength={500} rows={3} value={pickupForm.notes} onChange={(event) => setPickupForm({ ...pickupForm, notes: event.target.value })} placeholder="Anything the collection team should know?" /></label>
            {pickupMessage && <p className="workspace-message" role="status">{pickupMessage}</p>}
            <button className="button button-green" disabled={pickupBusy}>{pickupBusy ? "Submitting…" : "Request pickup"} <ArrowRight size={16} /></button>
          </form>
        </section>

        <section className="workspace-panel">
          <div className="workspace-heading"><div><div className="section-kicker">Your activity</div><h2>Pickup requests</h2></div><Clock3 size={20} /></div>
          {pickups.length === 0 ? <p className="workspace-empty">No pickup requests yet. Schedule one to get started.</p> : (
            <div className="workspace-list">
              {pickups.map((pickup) => (
                <article className="workspace-list-item" key={pickup._id}>
                  <div className="list-item-top"><strong>{pickup.wasteType} waste</strong><span className={`status-pill status-${pickup.status}`}>{pickup.status.replace("_", " ")}</span></div>
                  <p><MapPin size={13} /> {pickup.address}</p>
                  <small>{new Date(pickup.scheduledDate).toLocaleDateString()} · {pickup.ward || "Ward not specified"}</small>
                  {pickup.status === "requested" && <button className="subtle-action" onClick={() => cancelPickup(pickup._id)}>Cancel request</button>}
                </article>
              ))}
            </div>
          )}
          <div className="points-summary"><CheckCircle2 size={17} /><span>{wallet ? `${wallet.pointsPerCompletedPickup} points for each completed pickup · ${wallet.completedPickups} completed` : "Loading rewards…"}</span></div>
          {rewardHistory.length > 0 && <div className="points-history"><strong>Recent points earned</strong>{rewardHistory.slice(0, 3).map((entry) => <div key={entry.pickupId}><span>{entry.wasteType} pickup</span><span>+{entry.points} · {new Date(entry.completedAt).toLocaleDateString()}</span></div>)}</div>}
        </section>
      </div>

      <div className="resident-workspace-grid resident-lower-grid">
        <section className="workspace-panel">
          <div className="workspace-heading"><div><div className="section-kicker">Help your neighborhood</div><h2>Report a service issue</h2></div><Send size={19} /></div>
          <form className="workspace-form" onSubmit={submitComplaint}>
            <label>Issue type
              <select value={complaintForm.category} onChange={(event) => setComplaintForm({ ...complaintForm, category: event.target.value })}>
                <option value="missed_pickup">Missed pickup</option><option value="overflowing_bin">Overflowing bin</option><option value="illegal_dumping">Illegal dumping</option><option value="other">Other</option>
              </select>
            </label>
            <label>Location<input required minLength={3} maxLength={300} value={complaintForm.location} onChange={(event) => setComplaintForm({ ...complaintForm, location: event.target.value })} placeholder="Where did this happen?" /></label>
            <label>What happened?<textarea required minLength={10} maxLength={2000} rows={4} value={complaintForm.description} onChange={(event) => setComplaintForm({ ...complaintForm, description: event.target.value })} placeholder="Describe the issue so the municipal team can follow up." /></label>
            {complaintMessage && <p className="workspace-message" role="status">{complaintMessage}</p>}
            <button className="button button-green" disabled={complaintBusy}>{complaintBusy ? "Submitting…" : "Submit report"} <ArrowRight size={16} /></button>
          </form>
          <div className="workspace-list complaint-list">
            {complaints.slice(0, 4).map((complaint) => <article className="workspace-list-item" key={complaint._id}><div className="list-item-top"><strong>{complaint.category.replaceAll("_", " ")}</strong><span className={`status-pill status-${complaint.status}`}>{complaint.status.replace("_", " ")}</span></div><p>{complaint.location}</p><small>{new Date(complaint.createdAt).toLocaleDateString()}</small></article>)}
          </div>
        </section>

        <section className="workspace-panel">
          <div className="workspace-heading"><div><div className="section-kicker">Sort with confidence</div><h2>Waste segregation guide</h2></div><Recycle size={20} /></div>
          <form className="guide-search" onSubmit={searchGuide}>
            <input aria-label="Search waste guide" value={guideQuery} onChange={(event) => setGuideQuery(event.target.value)} placeholder="Search e.g. batteries, paper…" />
            <button className="button button-green" type="submit">Search</button>
          </form>
          <div className="guide-results">
            {guide.map((entry) => <article className="guide-result" key={entry.category}><span>{entry.title}</span><p>{entry.items.length ? entry.items.join(", ") : "See local guidance for this category."}</p><small>{entry.guidance}</small></article>)}
            {!guide.length && <p className="workspace-empty">No matching guidance. Try another item or category.</p>}
          </div>
        </section>
      </div>
      <div className="dashboard-footer-note"><CircleHelp size={16} /><span>Collection timing and local handover rules are managed by your municipal service.</span></div>
    </main>
  );
}

function LoadingScreen() {
  return <main className="loading-screen"><span className="loading-leaf"><Leaf size={22} /></span><span>Making room for a cleaner city…</span></main>;
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/auth/me")
      .then(({ data }) => setUser(data.user))
      .catch((error) => {
        if (error.response?.status !== 401) console.error("Could not restore the CleanCity session.", error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (loading || !location.hash) return;
    if (location.pathname !== "/") {
      navigate(`/${location.hash}`, { replace: true });
      return;
    }
    const targetId = decodeURIComponent(location.hash.slice(1));
    const timeout = window.setTimeout(() => {
      document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
    return () => window.clearTimeout(timeout);
  }, [loading, location.pathname, location.hash, navigate]);

  async function signOut() {
    try {
      await api.post("/auth/logout");
      setUser(null);
    } catch (error) {
      console.error("Could not sign out of CleanCity.", error);
    }
  }

  if (loading) return <LoadingScreen />;
  return (
    <>
      <Header user={user} onSignOut={signOut} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="login" onAuthenticated={setUser} />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <AuthPage mode="register" onAuthenticated={setUser} />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} onSignOut={signOut} /> : <Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
