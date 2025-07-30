    import { AuthOptions } from "next-auth";
    import CredentialsProvider from "next-auth/providers/credentials";
    import { connectDB } from "./db";
    import User, { IUser } from "@/models/user";
    import bcrypt from "bcryptjs";


    export const authOptions: AuthOptions = {
        providers: [
            CredentialsProvider({
                name: "Crendentials",

                credentials: {
                    email: {label: "Email", type: "text"},
                    password: {label: "Password", type: "password"}
                },
                async authorize(credentials) {
                    try {
                        if (!credentials?.email || !credentials.password) return null

                        await connectDB()
                        const user = await User.findOne({ email: credentials.email })

                        if (!user) {
                            console.log("❌ User not found")
                            return null
                        }

                        const isValid = await bcrypt.compare(credentials.password, user.password)

                        if (!isValid) {
                            console.log("❌ Invalid password")
                            return null
                        }

                        return user
                    } catch (err) {
                        console.error("❌ Error in authorize:", err)
                        return null
                    }
                }

            })
        ],
        session: {
            strategy: "jwt",
            maxAge: 15*60,
            updateAge: 5*60
        },
        callbacks: {
            async jwt({token, user}) {
                if(user) {
                    token.id = user.id
                    token.email = user.email
                    token.username = user.username;
                    token.avatarUrl = user.avatarUrl;
                }
                return token
            },
            async session({session, token}) {
                if(token) {
                    session.user.id = token.id
                    session.user.username = token.username
                    session.user.email = token.email
                    session.user.avatarUrl = token.avatarUrl
                }
                return session
            }
        },
        pages: {
            signIn: "/login",
            signOut: "/logout"
        },
        secret: process.env.NEXTAUTH_SECRET
    }