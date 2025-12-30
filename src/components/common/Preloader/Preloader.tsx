import spinner from '../../../assets/images/spinner.svg';

type PropsType = {}

let Preloader: React.FC<PropsType> = () => {
    return <img src={spinner} alt="Loading..." />;
}
export default Preloader;