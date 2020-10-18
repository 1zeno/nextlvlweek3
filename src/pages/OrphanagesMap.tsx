import React from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import "leaflet/dist/leaflet.css";

import "../styles/pages/orphanages-map.css";

import mapMarkerImg from "../images/map-marker.svg";
import mapIcon from "../utils/mapIcon";

interface IOrphanage{
    id: number;
    latitude: number;
    longitude: number;
    name: string;
}

function OrphanagesMap(){
    const [ orphanages, setOrphanages ] = React.useState<IOrphanage[]>([]);

    React.useEffect(() => {
        const request = async() => {
            try{
                const response = await api.get("orphanages");
                setOrphanages(response.data);
            }catch(e){
                console.log(e);
            }
        }
        request();
    },[])

    return(
        <div id="page-map">
            <aside>
                <header>
                    <img src={mapMarkerImg} alt="Happy"></img>

                    <h2>Escolha um orfanato no mapa</h2>
                    <p>Muitas crianças estão esperando a sua visita :)</p>
                </header>

                <footer>
                    <strong>Lauro de Freitas</strong>
                    <span>Bahia</span>
                </footer>
            </aside>

            <Map
                center={[-12.9031533,-38.3466118]}
                zoom={15}
                style={{ width:"100%", height: "100%" }}>

                <TileLayer 
                    url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {orphanages.map(orphanage => {
                    return (
                    <Marker 
                        key={orphanage.id}
                        icon={mapIcon}
                        position={[orphanage.latitude,orphanage.longitude]}
                        >
                        <Popup closeButton={false} minWidth={240} maxWidth={240} className="map-popup">
                            {orphanage.name}
                        <Link to={`/orphanage/${orphanage.id}`} >
                            <FiArrowRight size={20} color="#FFF" />
                        </Link>
                        </Popup>
                    </Marker>  
                )
                })} 
            </Map>
                
            <Link to={"/orphanages/create"} className="create-orphanage">
                <FiPlus size={32} color="#FFF" />
            </Link>
        </div>
    );
}

export default OrphanagesMap;