import { Query, Resolver } from "type-graphql";

@Resolver()
export class HelloResovler {
    @Query(() => String)
    hello() {
        return "Hello world"
    }
}