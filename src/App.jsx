import { Button } from "@/components/ui/button"
import { Camera } from 'lucide-react';
import './App.css'

function App() {

  return (
    <>
      <p className='text-red-800 font-bold'>Hola Fernando, soy Fernando</p>
      <Button>Click me</Button>
      <Camera color="red" size={48} />
    </>
  )
}

export default App
