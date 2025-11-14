import { Tag } from "./Tag";
import { StyledTagCreator } from "./styles";
import { useState, useEffect } from "react";
import Tag

export function TagCreator() {
    const [tags, setTags] = useState<{ color: string; name: string }[]>([]);

    // Pull data from server or DB
    function getTags() {
        const pulledTags = [
            { color: "teal", name: "meow" },
            { color: "orange", name: "meow1" },
        ];

        setTags(pulledTags);
    }

    useEffect(() => {
        getTags();
    }, []);

    return (
        <StyledTagCreator>
            {tags.map((tag) => (
                <Tag 
                    key={tag.name}
                    color={tag.color as any} 
                    name={tag.name} 
                />
            ))}
        </StyledTagCreator>
    );
}