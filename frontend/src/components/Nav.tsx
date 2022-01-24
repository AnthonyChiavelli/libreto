import { useAdminStatus } from 'hooks'
import * as React from 'react'
import { Link } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

export default function (): React.ReactElement {
  const isAdmin = useAdminStatus()
  return (
    <Menu text>
      <Menu.Menu position="left">
        {/* <Menu.Item>
          <Link to="/">Home</Link>
        </Menu.Item> */}

        <Menu.Item>
          <Link to="/">Home</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/posts/c/music">Music</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/posts/c/woodworking">Woodworking</Link>
        </Menu.Item>
        <Menu.Item>
          <Link to="/posts/c/software">Software</Link>
        </Menu.Item>
        {isAdmin && (
          <Menu.Item>
            <Link to="/admin">Admin</Link>
          </Menu.Item>
        )}
      </Menu.Menu>
    </Menu>
  )
}
