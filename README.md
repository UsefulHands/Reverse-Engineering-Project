A research project focused on understanding pointer maps, pointer chains, IL2CPP architecture, and server-client communication in Unity games.

I spent hundreds of hours learning reverse engineering tools and frameworks such as Cheat Engine, Ghidra, dnSpy, Frida, Il2CppDumper, and several other utilities to understand how modern Unity games work internally.

This project and the cheat itself are no longer maintained. That is why I am publicly sharing this repository.

Before continuing, I want to make it clear that I do not support cheating in online games. For me, this project was purely a technical challenge and a learning experience focused on reverse engineering and game security.

My previous implementation relied on screen rendering and image detection to capture events such as bait drops, fish strikes, and fishing minigames. The performance was poor, so I decided to access the required information directly from memory instead.

At first, I believed simple tools such as Cheat Engine would be enough to trace pointer chains. Later, I realized that modern Unity IL2CPP games require much deeper analysis. I moved on to tools like Ghidra, dnSpy, Il2CppDumper, and multiple dumpers to inspect the game's internal structures and understand its logic.

Eventually, I started using Frida and frida-il2cpp-bridge to hook game methods at runtime. The system worked reliably until the game introduced a new anti-cheat update.

The anti-cheat system obfuscated class, method, and field names, encrypted DLL names, and removed critical exports from GameAssembly.dll. To continue my research, I installed an older version of the game without anti-cheat protection and compared the RVA structures between versions.

During comparison, I noticed that the older version exposed more metadata and fields than the new version. After building comparison scripts and analyzing old dump files, I was able to recover some information from the updated build. However, even with old memory layouts and RVA references, accessing runtime memory became extremely difficult due to ASLR and dynamic memory allocation.

At that point, I decided to stop the project and publish the repository for educational purposes.

What I learned after hundreds of hours:

Unity IL2CPP is significantly more secure than the old Mono runtime.
Obfuscation, encryption, and limiting GameAssembly exports are extremely effective against reverse engineering.
ASLR and dynamic memory allocation add major difficulty for memory-based cheats.
Large multiplayer games should invest heavily in anti-cheat architecture from the beginning.
