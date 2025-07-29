import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import InputField from '../components/InputField';
import Button from '../components/Button';

const schema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email().required("Email is required"),
});

export default function SignUpForm() {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = (data) => {
    alert("SignUp: " + JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-bold mb-4">Sign Up</h2>
      <InputField label="Name" name="name" register={register} error={errors.name} />
      <InputField label="Email" name="email" register={register} error={errors.email} />
      <Button>Submit</Button>
    </form>
  );
}
