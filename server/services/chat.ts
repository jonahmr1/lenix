import dotenv from 'dotenv'
import axios from 'axios'
import path from 'path'

const resourcePath = GetResourcePath(GetCurrentResourceName())
const envPath = path.join(resourcePath, '.env')
const result = dotenv.config({ path: envPath })

if (result.error) {
  console.error('Error loading .env:', result.error)
}

const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN
const SERVER_ID = process.env.DISCORD_SERVER_ID

function integerToHexadecimal(integer: number): string {
  return `#${integer.toString(16).padStart(6, '0')}`;
}

export default async (userId: string) => {
  if (!BOT_TOKEN || !SERVER_ID) {
    console.error('Missing DISCORD_BOT_TOKEN or DISCORD_SERVER_ID in .env')
    return []
  }
  const headers = {
    'Authorization': `Bot ${BOT_TOKEN}`,
    'Content-Type': 'application/json'
  }

  try {
    const memberRes = await axios.get(
      `https://discord.com/api/v10/guilds/${SERVER_ID}/members/${userId}`,
      { headers }
    )
    const member = memberRes.data
    
    const rolesRes = await axios.get(
      `https://discord.com/api/v10/guilds/${SERVER_ID}/roles`,
      { headers }
    )
    const allRoles = rolesRes.data
    
    const userRoles = allRoles.filter((role: { id: string }) => 
      member.roles.includes(role.id)
    )
    
    const hoistedRole = userRoles.find((role: { name: string; id: string, color: number, hoist: boolean }) => {
      return role.hoist
    })

    if (hoistedRole) {
      return {name: member.user.global_name, role: {name: hoistedRole.name, color: integerToHexadecimal(hoistedRole.color)}}
    }
    return false
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Discord API Error:', error.response?.status, error.response?.data)
    } else {
      console.error('Error:', error)
    }
    throw error
  }
}