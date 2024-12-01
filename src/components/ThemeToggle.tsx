'use client'
import { useEffect, useState } from "react";
import { MdOutlineLightMode } from "react-icons/md";
import { MdOutlineDarkMode } from "react-icons/md";

const ThemeToggle = () => {

    const [ theme, setTheme ] = useState<string>("light")

    // getting the current theme of the user in case of refresh
    useEffect(() => {
        const currentTheme = localStorage.getItem('theme') || 'light'
        setTheme(currentTheme)
        document.documentElement.classList.toggle('dark', currentTheme === 'dark')
    },[])

    const toggleThemeOnClick = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.classList.toggle('dark', newTheme === 'dark')  // adding/removing dark class on tailwind based on the theme
        localStorage.setItem('theme', newTheme)
    } 

    return <div>
        <button
        onClick={toggleThemeOnClick}
        className="dark:text-white text-black pt-1.5"
        > 
            {
                theme === 'light' ? <MdOutlineDarkMode /> : <MdOutlineLightMode />
            }
        </button>
    </div>

}
export default ThemeToggle;