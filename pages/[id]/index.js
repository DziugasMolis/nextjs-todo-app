import fetch from 'isomorphic-unfetch';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Confirm, Button, Loader } from 'semantic-ui-react';

export default function Note({ note }) {
    const [confirm, setConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (isDeleting) {
            deleteNote();
        }
    }, [isDeleting]);

    const open = () => setConfirm(true);

    const close = () => setConfirm(false);

    const deleteNote = async () => {
        const noteId = router.query.id;
        try {
            const deleted = await fetch(`${process.env.VERCEL_URL}/api/notes/${noteId}`, {
                method: 'DELETE'
            });
            router.back();
        } catch (error) {
            console.error(error);
        }
    }

    const handleDelete = async () => {
        setIsDeleting(true);
        close();
    }

    return (
        <div className="note-container">
            {isDeleting ?
                <Loader active />
                : <>
                    <h1>{note.title}</h1>
                    <p>{note.description}</p>
                    <Button color='red' onClick={open}>Delete</Button>
                </>}
            <Confirm open={confirm} onCancel={close} onConfirm={handleDelete} />
        </div>
    );
}
export async function getServerSideProps({ query: { id } }) {
    const res = await fetch(`${process.env.VERCEL_URL}/api/notes/${id}`);
    const { data } = await res.json();

    return { props: { note: data } };
}

