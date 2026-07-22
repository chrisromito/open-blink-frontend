import { Image } from '@mantine/core';
import { Modal } from '@mantine/core';
import { Text } from '@mantine/core';


export type TImageModal = {
    title: string
    src: string
    description: string
    onClose: ()=> void
}

export default function ImageModal({ title, src, description, onClose }: TImageModal) {

    return (
        <Modal
            fullScreen
            onClose={onClose}
            opened
            title={title}
        >
            <Image
                src={src}
                alt={description}
            />
            <Text className={'py-2'}>{description}</Text>
        </Modal>
    );
}