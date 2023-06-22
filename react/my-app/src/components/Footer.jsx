function Footer() {
  let currentYear = new Date().getFullYear();
  return (
    <footer>
      <p> Copyright Gabriel De Paula</p>
      <p>{currentYear}</p>
    </footer>
  );
}

export default Footer;
