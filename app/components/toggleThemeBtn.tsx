import { Theme, useTheme } from "../theme"

export default function ToggleThemeBtn() {
  const [, setTheme] = useTheme();

  const toggleTheme = () => {
    setTheme((prevTheme) => {
      return prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    }
    );
  };

  return (
    <>
      <button className='btn btn-primary' onClick={toggleTheme}>Toggle Theme</button>
    </>
  );
}