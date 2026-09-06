fn main() {
    if let Some((date, short_id)) = get_commit_information() {
        println!("cargo:rustc-env=BUILD_COMMIT_DATE={}", date);
        println!("cargo:rustc-env=BUILD_COMMIT_ID={}", short_id);
    } else {
        eprintln!("cargo:warning=Failed to retrieve git commit information");
    }

    build_frontend();
}

fn build_frontend() {
    let pnpm = if cfg!(target_os = "windows") {
        "pnpm.cmd"
    } else {
        "pnpm"
    };

    let status = std::process::Command::new(pnpm)
        .args(["run", "build"])
        .current_dir("web")
        .status()
        .expect("Failed to execute pnpm build command");

    if !status.success() {
        panic!("Frontend build failed with status: {}", status);
    }
}

fn get_commit_information() -> Option<(String, String)> {
    let output = std::process::Command::new("git")
        .args(["log", "-1", "--format=%cd|%h", "--date=short"])
        .output()
        .ok()?;

    if !output.status.success() {
        return None;
    }

    let stdout = String::from_utf8(output.stdout).ok()?;
    let parts: Vec<&str> = stdout.trim().split('|').collect();

    if parts.len() != 2 {
        return None;
    }

    Some((
        parts[0].trim().to_string(), // date
        parts[1].trim().to_string(), // short id
    ))
}
