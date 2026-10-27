import os
import zipfile
import sys

def create_project_zip(output_path='CodeAlpha_SocialMediaPlatform.zip'):
    root_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
    exclude_dirs = {'node_modules', '.git', 'dist', '.aistudio', '__pycache__', '.vite'}
    exclude_files = {os.path.basename(output_path), 'project.zip', 'CodeAlpha_SocialMediaPlatform.zip'}

    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(root_dir):
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            for f in files:
                if f in exclude_files or f.endswith('.zip'):
                    continue
                full_path = os.path.join(root, f)
                rel_path = os.path.relpath(full_path, root_dir)
                zf.write(full_path, rel_path)

    print(f"Created {output_path} ({os.path.getsize(output_path)} bytes)")

if __name__ == '__main__':
    target = sys.argv[1] if len(sys.argv) > 1 else 'CodeAlpha_SocialMediaPlatform.zip'
    create_project_zip(target)
