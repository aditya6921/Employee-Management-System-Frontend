import { useNavigate } from "react-router-dom";
import { icons } from "../components/Icons";
import "./Home.css";

function Home() {
    const navigate = useNavigate();

    const painPoints = [
        {
            icon: icons.edit,
            title: "The register never balances",
            text: "Tally marks get smudged, pages go missing, and the count at month-end never quite matches what actually happened on the floor."
        },
        {
            icon: icons.clock,
            title: "Extra hours get forgotten",
            text: "An employee stays late to finish a delivery, and by the 30th nobody remembers to pay them for it."
        },
        {
            icon: icons.xCircle,
            title: "No record when it matters",
            text: "A dispute over an absent day or a late arrival comes down to memory, because there's nothing to point to."
        }
    ];

    const features = [
        {
            icon: icons.usersRound,
            title: "Employee records",
            text: "Every person on your payroll — role, join date, monthly salary — kept in one place instead of a notebook you can lose."
        },
        {
            icon: icons.calendarCheck,
            title: "Daily attendance",
            text: "Mark each employee present, absent, on leave, or half-day in a few taps. No more end-of-day scribbling."
        },
        {
            icon: icons.wallet,
            title: "Salary, worked out for you",
            text: "Absent days are deducted and extra hours are added as overtime pay automatically, so the final payable amount is never a guess."
        },
        {
            icon: icons.fileText,
            title: "Monthly reports",
            text: "A clean record of who worked when, ready to show an employee or settle a disagreement in seconds."
        }
    ];

    const steps = [
        {
            title: "Add your employees",
            text: "Owner signs up once, then adds every person working in the shop — no per-seat forms to fill out."
        },
        {
            title: "Mark attendance daily",
            text: "A minute each morning replaces a page of the paper register, with the day's status logged the moment it happens."
        },
        {
            title: "Let salary calculate itself",
            text: "At month-end, open Salary and the payable amount is already there — deductions and overtime included."
        }
    ];

    return (
        <div className="home">
            <header className="home-nav">
                <div className="home-nav-inner">
                    <div className="home-brand">
                        <div className="home-brand-icon">{icons.shield}</div>
                        <div>
                            <div className="home-brand-text">EMAS</div>
                            <div className="home-brand-subtext">Attendance &amp; Salary, sorted</div>
                        </div>
                    </div>

                    <nav className="home-nav-links">
                        <a href="#features">Features</a>
                        <a href="#how-it-works">How it works</a>
                    </nav>

                    <div className="home-nav-actions">
                        <button className="home-btn-ghost" onClick={() => navigate("/login")}>
                            Log in
                        </button>
                        <button className="home-btn-primary" onClick={() => navigate("/register")}>
                            Register your shop
                        </button>
                    </div>
                </div>
            </header>

            <main>
                <section className="home-hero">
                    <div className="home-hero-copy">
                        <p className="home-kicker">For local shops and small teams</p>
                        <h1>
                            Put the attendance register down. Let the app carry the count.
                        </h1>
                        <p className="home-hero-sub">
                            EMAS replaces the paper register shop owners use to track who came in,
                            who was late, and who stayed back — and turns that into an accurate
                            salary at the end of every month, without an evening of manual maths.
                        </p>
                        <div className="home-hero-actions">
                            <button className="home-btn-primary home-btn-lg" onClick={() => navigate("/register")}>
                                Get started free
                            </button>
                            <button className="home-btn-ghost home-btn-lg" onClick={() => navigate("/login")}>
                                I already have an account
                            </button>
                        </div>
                        <p className="home-hero-note">
                            Built for owners with a handful of employees, not an HR department.
                        </p>
                    </div>

                    <div className="home-hero-visual" aria-hidden="true">
                        <div className="home-register-card">
                            <div className="home-register-head">
                                <span>Today's attendance</span>
                                <span className="home-register-date">24 Sep</span>
                            </div>
                            <ul className="home-register-list">
                                <li>
                                    <span>Ramesh Kumar</span>
                                    <span className="badge badge-present">Present</span>
                                </li>
                                <li>
                                    <span>Sunita Devi</span>
                                    <span className="badge badge-halfday">Half-day</span>
                                </li>
                                <li>
                                    <span>Arjun Singh</span>
                                    <span className="badge badge-absent">Absent</span>
                                </li>
                                <li>
                                    <span>Priya Sharma</span>
                                    <span className="badge badge-leave">Leave</span>
                                </li>
                            </ul>
                            <div className="home-register-foot">
                                <span>Final payable salary</span>
                                <strong>₹18,420.00</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="home-problem">
                    <h2>Sound familiar?</h2>
                    <p className="home-section-sub">
                        This is the exact headache EMAS was built to take off an owner's plate.
                    </p>
                    <div className="home-problem-grid">
                        {painPoints.map((p) => (
                            <div className="home-problem-card" key={p.title}>
                                <div className="home-problem-icon">{p.icon}</div>
                                <h3>{p.title}</h3>
                                <p>{p.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="features" className="home-features">
                    <h2>Everything the register used to do, done properly</h2>
                    <p className="home-section-sub">
                        Four screens cover the whole job: who works for you, who showed up, what
                        they're owed, and proof of all three.
                    </p>
                    <div className="home-features-grid">
                        {features.map((f) => (
                            <div className="home-feature-card" key={f.title}>
                                <div className="home-feature-icon">{f.icon}</div>
                                <h3>{f.title}</h3>
                                <p>{f.text}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section id="how-it-works" className="home-steps">
                    <h2>Three steps, no training needed</h2>
                    <div className="home-steps-list">
                        {steps.map((s, i) => (
                            <div className="home-step" key={s.title}>
                                <div className="home-step-number">{i + 1}</div>
                                <div>
                                    <h3>{s.title}</h3>
                                    <p>{s.text}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="home-cta">
                    <h2>Your first day of digital attendance can start now.</h2>
                    <p>Free to set up. Add your employees and mark today's attendance in minutes.</p>
                    <button className="home-btn-primary home-btn-lg" onClick={() => navigate("/register")}>
                        Register your shop
                    </button>
                </section>
            </main>

            <footer className="home-footer">
                <div className="home-brand">
                    <div className="home-brand-icon">{icons.shield}</div>
                    <div className="home-brand-text">EMAS</div>
                </div>
                <p>Employee Management &amp; Attendance System — built for small business owners.</p>
            </footer>
        </div>
    );
}

export default Home;
