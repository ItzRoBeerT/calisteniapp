export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-background flex justify-between px-4 py-2">
      <span className="text-sm">Made with love by Us</span>
      <span className="text-sm">Copyright ©{currentYear}</span>
    </footer>
  )
}
