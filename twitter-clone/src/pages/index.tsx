import Image from 'next/image'
import { Inter } from 'next/font/google'
import { Client, Databases, Models, Account} from 'appwrite'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useEffect, useState } from 'react';
const inter = Inter({ subsets: ['latin'] })

export default function Home({ tweets }: InferGetServerSidePropsType<typeof getServerSideProps>)  {
  console.log("collection",tweets)
  const [user, setUser] = useState("")

  useEffect(()=> {
    const client = new Client();
    const account = new Account(client);

    client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT!)

    const promise = account.get()
    promise.then((reponse)=> {
      setUser(reponse.email)
    }, (err)=> { console.log(err)})
  },[])

  // function async create user signup for AppWrite
  const createUser =  async () =>{
    const client = new Client();
    const account = new Account(client);

    client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT!)
    
    const response = account.create(
      'grace', 'birindwan@gmail.com', 'firene123#'
    )
    response.then((response)=>{
      console.log("current",response.email)
      setUser(response.email)
    }, (err)=> console.log(err))
  }


  // logout session
  const logoutSession =  async () =>{
    const client = new Client();
    const account = new Account(client);

    client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT!)
    
    const response = account.deleteSessions()
    response.then((response)=>{
      console.log(response)
      setUser("")
    }, (err)=> console.log(err))
  }

  // login session
  const createEmailSession =  async () =>{
    const client = new Client();
    const account = new Account(client);

    client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT!)
    
    const response =  account.createEmailSession('birindwan@gmail.com', 'firene123#')
    response.then((response)=>{
      console.log("current",response.providerUid)
      setUser(response.providerUid)
    }, (err)=> console.log(err))
  }

  // create new tweet 
  const createTweet = async() => {
    const client = new Client();

  client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT!)

  const databases = new Databases(client);
  
  const response = databases.createDocument(
    process.env.NEXT_PUBLIC_DATABASE!,
    process.env.NEXT_PUBLIC_TWEETS_COLLECTION!,
    "uniqueID",
    {text: "this is the second tweet"}
  );
  response.then((response)=> {
    console.log(response)
  }, (err)=> console.log(err))
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <header>
        {user && (<p>hello: {user}</p>)}
        
      </header>
     <div className='flex gap-4'>
      <button className="px-4 py-2 bg-blue-300 text-red-400" onClick={createUser}>Sign up</button>
      <button className="px-4 py-2 bg-blue-300 text-red-400" onClick={createEmailSession}>Sign in</button>
      <button className="px-4 py-2 bg-blue-300 text-red-400" onClick={logoutSession}>logout</button>
     </div>
     <div>
      <div>
        <button onClick={createTweet} className='px-4 py-3 rounded-xl bg-black text-white'>create tweet</button>
      </div>
      {tweets.documents.map((tweet, i)=> (
        <div key={i}>
          <h3>{tweet.$id}</h3>
          <h3>{tweet.text}</h3>
          <h3>{tweet.$createdAt}</h3>
        </div>
      ))}
     </div>
    </main>
  )
}

//Models.DocumentList<Models.Document>
type Tweet = {
  tweets: Models.DocumentList<Models.Document>
}

export const getServerSideProps: 
GetServerSideProps<{tweets: Tweet} | Tweet> = async () => {
  const client = new Client();

  client
    .setEndpoint(process.env.NEXT_PUBLIC_ENDPOINT!)
    .setProject(process.env.NEXT_PUBLIC_PROJECT!)

  const databases = new Databases(client);
  
  const tweets = await databases.listDocuments(
    process.env.NEXT_PUBLIC_DATABASE!,
    process.env.NEXT_PUBLIC_TWEETS_COLLECTION!
  );

  return {
    props: { tweets }
  }
}



