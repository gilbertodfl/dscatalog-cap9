import { Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ButtonIcon from 'components/ButtonIcon';
import { getAuthData, requestBackendLogin, saveAuthData } from 'util/requests';
import { useState } from 'react';

import './styles.css';

type FormData = {
  username: string;
  password: string;
};
/* maria@gmail.com
senha: 123456
*/
const Login = () => {
  const [hasError, setHasError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  // useHIstory permite fazer redirecionamento, mudança de rotas
  const history = useHistory();
  const onSubmit = (formData: FormData) => {
    requestBackendLogin(formData)
      .then((response) => {
        console.log('sucesso ', response);
        saveAuthData( response.data);
        const token = getAuthData().access_token;
        console.log ( token);
        setHasError(false);
        history.push('admin');
      })
      .catch((error) => {
        console.log('erro ', error);
        setHasError(true);
      });
  };

  return (
    <div className="base-card login-card">
      <h1>LOGIN</h1>
      {hasError && (
        <div className="alert alert-danger">
          Erro ao tentar efetuar login
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <input
            {...register('username', {
              required: 'Campo Obrigatório',
              pattern:{
                 value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                 message: 'Email inválido'
              }
            })}
            type="text"
            className={ `form-control base-input  ${errors.username ? 'is-invalid' : '' }`}
            placeholder="Email"
            name="username"
          />
          <div className="invalid-feedback d-block">
            {' '}
            {errors.username?.message}
          </div>
        </div>
        <div className="mb-2">
          <input
            {...register('password', {
              required: 'Campo Obrigatório',
            })}
            type="password"
            className={ `form-control base-input  ${errors.password ? 'is-invalid' : '' }`}
            placeholder="Password"
            name="password"
          />
          <div className="invalid-feedback d-block">
            {' '}
            {errors.password?.message}
          </div>
        </div>
        <Link to="/admin/auth/recover" className="login-link-recover">
          Esqueci a senha
        </Link>
        <div className="login-submit">
          <ButtonIcon text="Fazer login" />
        </div>
        <div className="signup-container">
          <span className="not-registered">Não tem Cadastro?</span>
          <Link to="/admin/auth/register" className="login-link-register">
            CADASTRAR
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
