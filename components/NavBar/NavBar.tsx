'use client'
import {Burger, Container, Divider, Drawer, Group, ScrollArea} from '@mantine/core'
import {useDisclosure} from '@mantine/hooks'
import classes from './Navbar.module.css'
import NavLink from '@/components/NavLink'

const links = [
    {link: '/timeline', label: 'Timeline'},
    {link: '/detections', label: 'Detections'}
]

export default function NavBar() {
    const [opened, {toggle, close}] = useDisclosure(false)

    const items = links.map((link) => (
        <NavLink
            key={link.label}
            href={link.link}
            className={classes.link}
        >
            {link.label}
        </NavLink>
    ))

    return (
        <header className={classes.header}>
            <Container size="md" className={classes.inner}>
                {/*<MantineLogo size={28} />*/}
                <Group gap={5} visibleFrom="xs">
                    {items}
                </Group>

                <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="xs"
                    size="sm"
                    aria-label="Toggle navigation"
                />
            </Container>

            <Drawer
                opened={opened}
                onClose={close}
                size="100%"
                padding="md"
                title="Navigation"
                hiddenFrom="xs"
                zIndex={1000000}
            >
                <ScrollArea h="calc(100vh - 80px" mx="-md">
                    <Divider my="sm"/>
                    {items}
                </ScrollArea>
            </Drawer>
        </header>
    )
}