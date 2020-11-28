import React from 'react';

const Footer = () => {
  return (
    <div className='footer'>
      <p className='text-center'>
        Made with <i className='fas fa-heart' /> in Berlin{' '}
        <a
          href='https://mertciflikli.com'
          target='_blank'
          rel='noopener noreferrer'
          className='portfolio-link'
        >
          © 2020 Mert Ciflikli
        </a>
      </p>
    </div>
  );
};

export default Footer;
