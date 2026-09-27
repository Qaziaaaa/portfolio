import { Github, Linkedin, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer role="contentinfo">
      <div className="wrap">
        <span className="f-top" aria-label="Qazi Farhan">QAZ\ FARHAN</span>
        <span className="f-role">Team Lead &amp; Full-Stack Engineer</span>

        <hr className="f-divider" />

        <div className="f-bottom">
          <span className="copyright">
            &copy; {new Date().getFullYear()} Qazi Farhan Ahmad. All rights reserved.
          </span>

          <div className="f-socials">
            <a href="https://github.com/Qaziaaaa" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={20} strokeWidth={1.6} />
            </a>
            <a href="https://www.linkedin.com/in/qazi-farhan-ahmad/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <Linkedin size={20} strokeWidth={1.6} />
            </a>
            <a href="https://wa.me/923141935787" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <MessageCircle size={20} strokeWidth={1.6} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
