import Link from 'next/link';
import { useState, useEffect } from 'react';
import fetch from 'isomorphic-unfetch';
import { Button, Form, Loader } from 'semantic-ui-react';
import { useRouter } from 'next/router';


const EditNote = ({ note }) => {
    const [form, setForm] = useState({
        title: note.title,
        description: note.description
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const router = useRouter();

    useEffect(() => {
        if (isSubmitting) {
            if (Object.keys(errors).length === 0) {
                editNote();
            } else {
                setIsSubmitting(false);
            }
        }
    }, [errors])

    const editNote = async () => {
        try {
            const res = await fetch(`${process.env.VERCEL_URL}/api/notes/${router.query.id}`, {
                method: 'PUT',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(form)
            });
            router.back();
        } catch (error) {
            console.error(error);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let errs = validate();
        setErrors(errs);
        setIsSubmitting(true);
    };
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        })
    };

    const validate = () => {
        let err = {};
        if (!form.title) {
            err.title = 'Title is required';
        }
        if (!form.description) {
            err.description = 'Description is required';
        }
        return err;
    }

    return (
        <div className="form-container">
            <h1>Update Note</h1>
            <div>
                {
                    isSubmitting ? <Loader active inline="centered" />
                        : <Form onSubmit={handleSubmit}>
                            <Form.Input fluid error={errors.title ? { content: 'Please enter a title', pointing: 'below' } : null} label='Title' placeholder='Title' name='title' value={form.title} onChange={handleChange} />
                            <Form.TextArea fluid error={errors.description ? { content: 'Please enter a description', pointing: 'below' } : null} label='Description' placeholder='Description' name='description' value={form.description} onChange={handleChange} />
                            <Button type='submit'>Update</Button>
                        </Form>
                }
            </div>
        </div>
    );
}

export async function getServerSideProps({ query: { id } }) {
    const res = await fetch(`${process.env.VERCEL_URL}/api/notes/${id}`);
    const { data } = await res.json();

    return { props: { note: data } };
}



export default EditNote;