import { useForm } from 'react-hook-form';
import InputField from '../components/InputField';
import Button from '../components/Button';

export default function ProfileForm() {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    alert("Profile Updated: " + JSON.stringify(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto bg-white p-6 shadow rounded">
      <h2 className="text-lg font-bold mb-4">Edit Profile</h2>
      <InputField label="Display Name" name="displayName" register={register} />
      <InputField label="Bio" name="bio" register={register} />
      <Button>Save</Button>
    </form>
  );
}
