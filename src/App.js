import React from 'react';
import logo from "./assets/logo/logo.png";
import "./App.css";

class App extends React.Component {
  render = () => {
    return (
      <div className="container">
        {/* HEADER */}
        <header className="header">
          <div className="logo">
            <img src={logo} alt="GoFlow Cleaning Services" className="logo-img" />
          </div>
          <div className="contact-info">
            <span className="phone">📞 (639) 994-7280</span>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <h1>GoFlow Services</h1>
          <p>
            Get ready for our new website, launching soon! It's designed to showcase the excellence of our services
          </p>
          <a href="mailto:allan@goflowservices.com" className="cta">
            📧 Get in Touch
          </a>
        </section>

        {/* VALUES */}
        <section className="values">
          <h2>Why People Trust GoFlow</h2>
          <div className="values-grid">
            <div className="value-box">
              <h3>⚡ Fast & Reliable</h3>
              <p>On-time and efficient services so you can enjoy a spotless space without delays.</p>
            </div>
            <div className="value-box">
              <h3>✨ Professional Results</h3>
              <p>Our trained team delivers quality cleaning that makes a lasting impression.</p>
            </div>
            <div className="value-box">
              <h3>🤝 Customer Focused</h3>
              <p>We listen, adapt, and tailor our services to your needs — your satisfaction comes first.</p>
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contact">
          <h2>Stay Connected</h2>
          <p>
            Have questions or want to work with us? <br />
            Drop us a message directly by email.
          </p>
          <a href="mailto:allan@goflowservices.com" className="cta secondary">
            ✉️ allan@goflowservices.com
          </a>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          <p>© {new Date().getFullYear()} GoFlow Cleaning Services. All rights reserved.</p>
        </footer>
      </div>
    );
  }
}

export default App;
