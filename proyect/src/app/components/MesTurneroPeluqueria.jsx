'use client';
import { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MascotasContext } from '../context/MascotaContext';
import { UserAuth } from '../context/AuthContext';
import { UseClient } from '../context/ClientContext';
import { postTurnoPeluqueria, sumarTurnoPeluqueria } from '../firebase';

const MyCalendarPeluqueria = () => {
  const { user } = UserAuth();
  const userId = user?.uid;

  const { mascota } = MascotasContext();
  const { datosCliente } = UseClient();
  console.log(datosCliente); 
  
  const [formData, setFormData] = useState({
    usuarioid: userId || '', // Asegurarse de asignar un valor por defecto
    nombre: datosCliente[0]?.datosCliente.nombre || '',
    apellido: datosCliente[0]?.datosCliente.apellido || '',
    direccion: datosCliente[0]?.datosCliente.direccion || '',
    telefono: datosCliente[0]?.datosCliente.telefono || '',
    selectedPet:  '',
    selectedTurno: 'mañana',
    corte: '',
    largo: '0',
    info: '',
    selectedDate: new Date(),
    transporte: true,
  });

  useEffect(() => {
    if (mascota && mascota.length > 0 && datosCliente) {
      const userPets = mascota.find((m) => m.usuarioId === userId);
      if (userPets && userPets.mascota && userPets.mascota.length > 0) {
        setFormData((prevData) => ({
          ...prevData,
          nombre: datosCliente.nombre || '',
          apellido: datosCliente.apellido || '',
          direccion: datosCliente.direccion || '',
          esquina: datosCliente.esquina || '',
          telefono: datosCliente.telefono || '',
          selectedPet: userPets.mascotas[0].nombre || ''
        }));
      }
    }
  }, [mascota, userId, datosCliente]);

  const handleDateChange = (newDate) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedDate: newDate
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Datos del formulario:', formData);
    postTurnoPeluqueria(formData);
    sumarTurnoPeluqueria(userId);
    alert('Turno registrado exitosamente');
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue
    }));
  };

  const tileDisabled = ({ date, view }) => {
    if (view === 'month') {
      return date.getDay() === 0 || date.getDay() === 6;
    }
  };

  return (
    <div className="bg-gray-100 p-4 sm:p-6 md:p-8 lg:p-10">
      <div className="p-4 sm:p-6 md:p-8 lg:p-10">
        <form className="flex flex-col items-center" onSubmit={handleFormSubmit}>
          <div className="w-full mb-4">
            <label htmlFor="selectedPet">Seleccione la mascota que necesita atención:</label>
            <select
  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
  name="selectedPet"
  id="selectedPet"
  onChange={handleChange}
  value={formData.selectedPet}
>
  <option value="">Selecciona tu mascota</option>
  {mascota && mascota.length > 0 && mascota.map((mascota) => (
      <option key={mascota.id} value={mascota.nombre}>
        {mascota.nombre}
      </option>
    )
  )}
</select>

          </div>
          <div className="w-full mb-4">
            <label htmlFor="selectedTurno">Seleccione el turno:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="selectedTurno"
              id="selectedTurno"
              onChange={handleChange}
              value={formData.selectedTurno}
            >
              <option value="mañana">Mañana</option>
              <option value="tarde">Tarde</option>
            </select>
          </div>
          <div className="w-full mb-4">
            <label htmlFor="corte">Seleccione el tipo de corte:</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="corte"
              id="corte"
              onChange={handleChange}
              value={formData.corte}
            >
              <option value="corte higienico">Corte Higiénico</option>
              <option value="de la raza">De la Raza</option>
              <option value="todo rapado">Todo Rapado</option>
            </select>
          </div>
          <div className="w-full mb-4">
            <label htmlFor="largo">Seleccione el largo del corte (en cm):</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="largo"
              id="largo"
              onChange={handleChange}
              value={formData.largo}
            >
              <option value="Solo Baño">Solo Baño</option>
              <option value="0">0 cm</option>
              <option value="1">1 cm</option>
              <option value="4">4 cm</option>
            </select>
          </div>
          <div className="w-full mb-4">
            <label htmlFor="info">Información adicional:</label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none"
              name="info"
              id="info"
              onChange={handleChange}
              value={formData.info}
              rows="4"
            ></textarea>
          </div>
          <div className="w-full">
            <Calendar
              className="mx-auto border border-gray-300 rounded-md"
              locale="es"
              onChange={handleDateChange}
              value={formData.selectedDate}
              tileDisabled={tileDisabled}
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 mt-4 rounded-md"
          >
            Confirmar cita
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyCalendarPeluqueria;
