import { OptionValues } from "commander";

declare global
{
    interface LSOptions extends OptionValues
    {
        filter: string[]
    }
}
