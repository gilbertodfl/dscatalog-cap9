import './styles.css';

// comand abaixo faz com que a imagem possa ser usado como um componente, veja a linha 17.

import { ReactComponent as MainImage } from 'assets/images/main-image.svg';
import ButtonIcon from 'components/ButtonIcon';
import { Link } from 'react-router-dom';
// forma tradicional: function Home() {
const Home = () => {
  return (
    <>
      <div className="home-container">
        <div className="base-card home-card">
          <div className="home-content-container">
            <h1> Conheça o melhor catálogo de produto</h1>
            <p>Ajudaremos você a encontrar os melhores produtos do mercado</p>
            <Link to="/products">
              <ButtonIcon text="Inicie agora a sua busca"/>
            </Link>
          </div>

          <div className="home-image-container">
            <MainImage />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
