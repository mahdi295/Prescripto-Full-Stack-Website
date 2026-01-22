import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {

  const { dToken, setDToken } = useContext(DoctorContext)
  const { aToken, setAToken } = useContext(AdminContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/')
    dToken && setDToken('')
    dToken && localStorage.removeItem('dToken')
    aToken && setAToken('')
    aToken && localStorage.removeItem('aToken')
  }

  return (
    <div className="sticky top-0 z-50 flex justify-between px-4 py-3 bg-white border-b it-wems-center sm:px-10">
      <div className="flex items-center gap-2 text-xs">
        <img
          onClick={() => navigate("/")}
          className="cursor-pointer w-36 sm:w-40"
          src={assets.admin_logo}
          alt=""
        />
        <p className="border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600">
          {aToken ? "Admin" : "Doctor"}
        </p>
      </div>
      <button
        onClick={() => logout()}
        className="px-10 py-2 text-sm text-white rounded-full bg-primary"
      >
        Logout
      </button>
    </div>
  );
}

export default Navbar