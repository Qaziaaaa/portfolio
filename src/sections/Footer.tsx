const Footer = () => {
  return (
    <footer role="contentinfo">
      Qazi Farhan ·{' '}
      <a href="https://github.com/Qaziaaaa" target="_blank" rel="noopener noreferrer">
        @Qaziaaaa
      </a>{' '}
      · AI Web Developer &amp; MERN Stack Expert
      <div className="copyright">
        &copy; {new Date().getFullYear()} Qazi Farhan Ahmad. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
