import React from 'react';
import Icon from './ui/Icon';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-lg font-semibold">
          <span>QR Code Generator</span>
        </div>
        <div className="flex space-x-4">
          <a
            href="https://www.linkedin.com/in/chrisvo3/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
            title="LinkedIn"
          >
            <Icon name="Linkedin" size={24} />
          </a>
          <a
            href="https://github.com/chris-v88"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-300"
            title="GitHub"
          >
            <Icon name="Github" size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
