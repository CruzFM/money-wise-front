export default function Navbar() {
  return (
    <header className="w-full border drop-shadow h-14">
      <nav className="container mx-auto">
        <ul className="flex flex-row">
            <li className="mr-auto">Logo</li>
            <li>Logout</li>
        </ul>
      </nav>
    </header>
  );
}
