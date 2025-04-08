import {useState} from "react";
import styles from "./Home.module.css"

function Home(){

    const chaveAPI = '6dd77b2fd08cc6e0a0ce79ffbdffaaf3';


    const [cidade, setCidade] = useState("");
    const [dadosClima, setDadosClima] = useState(null);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const buscarClima = async (e) => {
        e.preventDefault(); 
        if (!cidade) return;

        setCarregando(true);
        setErro("");
        setDadosClima(null);

        try {
            const resposta = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=${chaveAPI}&lang=pt_br&units=metric`
            );
            const dados = await resposta.json();

            if (dados.cod === 200) {
                setDadosClima(
                    {
                        nome: dados.name,
                        temperatura: dados.main.temp,
                        descricao: dados.weather[0].description,
                        sensacaoTermica: dados.main.feels_like,
                        temperaturaMinima: dados.main.temp_min,
                        temperaturaMaxima: dados.main.temp_max,
                        iconeTempo: dados.weather[0].icon,
                        umidade: dados.main.humidity
                    }
                )
            } else {
                setErro("Cidade não encontrada.");
            }
         } catch (error) {
                setErro("Erro ao buscar o clima");
            }
            finally {
                setCarregando(false);
            }
    }
    return(
       <div className={styles.container}>
        <div className={styles.container_titulo} >
            <h1>Previsão do Tempo</h1>
            <h2>Digite a cidade: </h2>
        </div>
        <form className={styles.form} >
        <input 
        className={styles.form_input}
        type="text"
        placeholder="Digite a cidade..."
        value={cidade} 
        onChange={(e) => setCidade(e.target.value)}/>
        <button
        className={styles.form_button}
        onClick={buscarClima} >Busque o clima</button>
        </form>
            {carregando && <p>Buscando clima...</p>}
            {erro && <p className="text-red-600">{erro}</p>}

            {dadosClima && (
                <div>
                    <img
                     src={`https://openweathermap.org/img/wn/${dadosClima.iconeTempo}@2x.png`} alt="dadosClima.descricao"
                     />
                    <h3>Cidade: {dadosClima.nome}    </h3> 
                    <h3>Temperatura: {dadosClima.temperatura}°C</h3>
                    <h3>Dados do Clima: {dadosClima.descricao}</h3>

                    <h3>Sensação Térmica: {dadosClima.sensacaoTermica}°C</h3>
                    <h3>Temperatura Máxima: {dadosClima.temperaturaMaxima}°C</h3>
                    <h3>Temperatura Mínima: {dadosClima.temperaturaMinima}°C</h3>
                    <h3>Umidade: {dadosClima.umidade}%</h3>
                </div>
            )}
       </div>
    )
}

export default Home;