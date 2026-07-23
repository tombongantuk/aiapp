"use client"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { SignInButton, SignUpButton, Show, UserButton,useClerk } from "@clerk/nextjs"

const navItems = [
  { label: "Library", href: '/' },
  { label: "Add Book", href: '/books/new' },
  
]

const Navbar = () => {
  const pathName = usePathname();
  const{user}=useClerk()
  return (
    <header className="w-full fixed z-50 bg-(--bg-primary)">
      <div className="wrapper navbar-heigth py-4 flex justify-between items-center">
        <Link href="/" className="flex gap-0.5 items-center">
          <Image src="/assets/logo.png" alt="bookified" width={42} height={26} />
          <span className="logo-text">Bookified</span>
        </Link>
        <nav className="w-fit flex gap-7.5 items-center">
          {navItems.map(({label,href}) => {
            const isActive = pathName === href || (href !== '/' && pathName.startsWith(href));
            return (
              <Link
                key={label}
                href={href}
                className={`nav-link-base ${isActive ? 'nav-link-active' : 'text-black hover:opacity-70'}`}
              >
                {label}
              </Link>
            );
          })}
          <div className="flex gap-7.5 items-center">
            <Show when="signed-out">
              <SignInButton mode="modal"/>
              <SignUpButton mode="modal" />
            </Show>
            <Show when="signed-in">
              <div className="nav-user-link">
                <UserButton />
                {user?.firstName && (
                  <Link href="/subscriptions" className="nav-user-name">{user.firstName}</Link>
                )}
              </div>
            </Show>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Navbar
