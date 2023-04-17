import os
import sys

import discord
from dotenv import load_dotenv

load_dotenv()
TOKEN = os.getenv('DISCORD_TOKEN')
GUILD = os.getenv('DISCORD_GUILD')

client = discord.Client(intents=discord.Intents.default())


@client.event
async def on_ready():
    channel = client.get_channel(1097125038622265497)
    await channel.send( "@everyone A new update of the Dev branch is available! ")
    await client.close()
    
client.run(TOKEN)