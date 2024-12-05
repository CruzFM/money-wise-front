import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import moneyWiseLogo from "../../assets/moneyWiseLogo.png";

export default function Navbar() {
    const navigate = useNavigate();

    const handleLogout = ()=>{
        sessionStorage.removeItem('auth_token');
        navigate('/login');
    }
  return (
    <header className="w-full border drop-shadow h-14 flex items-center">
      <nav className="container mx-auto px-2 md:px-4 max-w-4xl">
        <ul className="flex flex-row items-center">
            <li className="mr-auto font-semibold">
              <img src={moneyWiseLogo} width={40} /> 
            </li>
            <li>
                <button onClick={handleLogout}>
                    <LogOut size={25} />
                </button>
            </li>
        </ul>
      </nav>
    </header>
  );
}
