import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import InputField from '../components/InputField';
import Button from '../components/Button';

const schema = Yup.object().shape({
  email: Yup.string().required('Email không được bỏ trống').email('Email không hợp lệ'),
  password: Yup.string().required('Mật khẩu không được bỏ trống').min(6, 'Ít nhất 6 ký tự'),
});

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log('Dữ liệu đăng nhập:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-sm mx-auto">
      <h2 className="text-xl font-bold">Đăng nhập</h2>
      <InputField
        label="Email"
        name="email"
        placeholder="Nhập email"
        register={register}
        error={errors.email}
      />
      <InputField
        label="Mật khẩu"
        name="password"
        type="password"
        placeholder="Nhập mật khẩu"
        register={register}
        error={errors.password}
      />
      <Button type="submit">Đăng nhập</Button>
    </form>
  );
}
