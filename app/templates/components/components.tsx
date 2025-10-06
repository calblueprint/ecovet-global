export function NewRole() {

  return (
    <form>
      <label>
        Role Title:
        <input type="text" name="role_title" placeholder="da role" />
      </label>
      <label>
        Role Description:
        <input type="text" name="role_description" placeholder="da descript" />
      </label>
    </form>
  );
}

export function PhaseRole({role}: {role: string}) {

  return (
    <>
      <h3>{role}</h3>
      <form>
        <label>
            Question:
            <input type="text" name="phase_question" placeholder="what's 9 + 10?" />
          </label>
      </form>
    </>
  )
}

export function NewPhase({ roles }: { roles: string[] }) {

  return (
    <form>
      <label>
        Phase Title:
        <input type="text" name="phase_title" placeholder="da phase" />
      </label>
      <label>
        Phase Description:
        <input type="text" name="phase_description" placeholder="da descript" />
      </label>
      {roles.map((role) => (
        <PhaseRole role={role}/>
      ))}
  </form>
  );
}