import React from "react";
import api from "../services/api";
import { FiClock, FiInfo } from "react-icons/fi";
import { Map, Marker, TileLayer } from "react-leaflet";
import { useParams } from "react-router-dom";

import '../styles/pages/orphanage.css';
import Sidebar from "../components/Sidebar";
import mapIcon from "../utils/mapIcon";

interface IOrphanage{
  latitude: number;
  longitude: number;
  name: string;
  description: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    url: string;
  }>;
}

interface IParams{
  id: string;
}

export default function Orphanage() {
  const { id } = useParams<IParams>();
  const [ orphanage, setOrphanage ] = React.useState<IOrphanage>();
  const [ activeImageIndex, setActiveImageIndex ] = React.useState(0);

  React.useEffect(() => {
      const request = async() => {
          try{
              const response = await api.get(`orphanage/${id}`);
              setOrphanage(response.data);
              console.log(response);
          }catch(e){
              console.log(e);
          }
      }
      request();
  }, [ id ])

  if(!orphanage){
    return(
      <h1>Carregando...</h1>
    )
  }
  console.log(orphanage.open_on_weekends)
  return (
    <div id="page-orphanage">
      <Sidebar />

      <main>
        <div className="orphanage-details">
          <img src={orphanage.images[activeImageIndex].url} alt={orphanage.name} />

          <div className="images">
            {orphanage.images.map((image, index)=>(
              <button 
                key={ image.id } 
                className={activeImageIndex === index ? "active" : ""}
                type="button"
                onClick={() => {
                  setActiveImageIndex(index)
                }}
              >
                <img src={ image.url } alt={orphanage.name} />
              </button>
            ))}
          </div>
          
          <div className="orphanage-details-content">
            <h1>{orphanage.name}</h1>
            <p>{orphanage.description}</p>

            <div className="map-container">
              <Map 
                center={[ orphanage.latitude, orphanage.longitude ]} 
                zoom={16} 
                style={{ width: '100%', height: 280 }}
                dragging={false}
                touchZoom={false}
                zoomControl={false}
                scrollWheelZoom={false}
                doubleClickZoom={false}
              >
                <TileLayer 
                  url={"https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
                <Marker interactive={false} icon={mapIcon} position={[-27.2092052,-49.6401092]} />
              </Map>

              <footer>
                <a target="_blank" rel="noopener noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${orphanage.latitude},${orphanage.longitude}`}>
                  Ver rotas no Google Maps
                </a>
              </footer>
            </div>

            <hr />

            <h2>Instruções para visita</h2>
            <p>Venha como se sentir mais à vontade e traga muito amor para dar.</p>

            <div className="open-details">
              <div className="hour">
                <FiClock size={32} color="#15B6D6" />
                Segunda à Sexta <br />
                {orphanage.opening_hours}
              </div>
            {orphanage.open_on_weekends ? (
              <div className="open-on-weekends">
                <FiInfo size={32} color="#39CC83" />
                Atendemos <br />
                fim de semana
              </div>
            ):(
            <div className="open-on-weekends dont-open">
              <FiInfo size={32} color="#FF669D" />
              Não Atendemos <br />
              fim de semana
            </div>
            )}
            </div>

{/*             <button type="button" className="contact-button">
              <FaWhatsapp size={20} color="#FFF" />
              Entrar em contato
            </button> */}
          </div>
        </div>
      </main>
    </div>
  );
}