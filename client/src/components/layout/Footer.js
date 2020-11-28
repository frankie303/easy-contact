import React from 'react';

const Footer = () => {
  return (
    <div className='footer'>
      <p className='text-center'>
        Made with <i className='far fa-heart' /> in Berlin{' '}
        <a
          href='https://mertciflikli.com'
          target='_blank'
          rel='noopener noreferrer'
        >
          © 2020 Mert Ciflikli
        </a>
      </p>
    </div>
  );
};

export default Footer;
